package entity

type Datatype string

const (
	Datatype_Text   Datatype = "text"
	Datatype_Number Datatype = "number"
)

type CoreFeature struct {
	ID          int
	Name        string
	Description string
	Requried    bool
	DataType    Datatype
	Icon        string
}
