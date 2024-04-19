package main

import (
	"fmt"
	"log"

	"github.com/go-jet/jet/v2/generator/metadata"
	"github.com/go-jet/jet/v2/generator/postgres"
	"github.com/go-jet/jet/v2/generator/template"
	postgres2 "github.com/go-jet/jet/v2/postgres"
	_ "github.com/lib/pq"
	"github.com/lulzshadowwalker/zoozie/api/internal/config"
	"github.com/serenize/snaker"
)

func main() {
	port, err := config.GetDatabasePort()
	if err != nil {
		panic(fmt.Errorf("failed to read database port because %w", err))
	}

	dbConnection := postgres.DBConnection{
		Host:       config.GetDatabaseHost(),
		Port:       port,
		User:       config.GetDatabaseUsername(),
		Password:   config.GetDatabasePassword(),
		DBName:     config.GetDatabaseName(),
		SchemaName: "public",
		SslMode:    "disable",
	}

	err = postgres.Generate(
		"./internal/database/.gen/",
		dbConnection,
		template.Default(postgres2.Dialect).
			UseSchema(func(schemaMetaData metadata.Schema) template.Schema {
				return template.DefaultSchema(schemaMetaData).
					UseModel(template.DefaultModel().
						UseTable(func(table metadata.Table) template.TableModel {
							return template.DefaultTableModel(table).
								UseField(func(columnMetaData metadata.Column) template.TableModelField {
									defaultTableModelField := template.DefaultTableModelField(columnMetaData)
									return defaultTableModelField.UseTags(
										fmt.Sprintf(`json:"%s,omitempty"`, snaker.SnakeToCamelLower(columnMetaData.Name)),
									)
								})
						}),
					)
			}),
	)

	if err != nil {
		log.Fatalf("failed to migrate data beacause %s", err)
	}
}
