package models

type Upload struct {
	ID               int
	File             string
	FileType         string
	OriginalFileName string
	UploadedBy       int
}
