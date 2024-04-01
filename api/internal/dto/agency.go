package dto

type GetAgencyBySlugRequest struct {
	Slug string `query:"slug"`
}
