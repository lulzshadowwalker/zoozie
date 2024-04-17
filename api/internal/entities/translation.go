package entities

type Translation[T any] struct {
	Value        T
	LanguageCode string
}
