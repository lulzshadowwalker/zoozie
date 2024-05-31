package main

import (
	"fmt"
	"strings"

	"github.com/go-playground/validator/v10"
)

// Define your struct
type MyStruct struct {
	DescriptionFR string `validate:"dynamicrequired=DescriptionEN"`
	DescriptionEN string `validate:"dynamicrequired=DescriptionFR"`
	Title         string `validate:"dynamicrequired=Subtitle"`
	Subtitle      string `validate:"dynamicrequired=Title"`
}

// Custom validation function for the 'dynamicrequired' tag
func dynamicRequired(fl validator.FieldLevel) bool {
	fieldValue := fl.Field().String()
	paramFields := strings.Split(fl.Param(), ",")

	for _, paramField := range paramFields {
		otherField := fl.Parent().FieldByName(strings.TrimSpace(paramField)).String()
		if fieldValue != "" && otherField == "" {
			return false
		}
		if fieldValue == "" && otherField != "" {
			return false
		}
	}

	return true
}

func main() {
	// Create a new validator instance
	validate := validator.New()

	// Register the custom validation function
	validate.RegisterValidation("dynamicrequired", dynamicRequired)

	// Test cases
	testCases := []MyStruct{
		{DescriptionFR: "", DescriptionEN: "", Title: "", Subtitle: ""},
		{DescriptionFR: "French description", DescriptionEN: "", Title: "", Subtitle: ""},
		{DescriptionFR: "", DescriptionEN: "English description", Title: "", Subtitle: ""},
		{DescriptionFR: "French description", DescriptionEN: "English description", Title: "", Subtitle: ""},
		{DescriptionFR: "", DescriptionEN: "", Title: "Some title", Subtitle: ""},
		{DescriptionFR: "", DescriptionEN: "", Title: "", Subtitle: "Some subtitle"},
		{DescriptionFR: "", DescriptionEN: "", Title: "Some title", Subtitle: "Some subtitle"},
	}

	for i, tc := range testCases {
		err := validate.Struct(tc)
		if err != nil {
			fmt.Printf("Test case %d: Failed validation - %s\n", i, err)
		} else {
			fmt.Printf("Test case %d: Passed validation\n", i)
		}
	}
}
