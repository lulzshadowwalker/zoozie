package dto

import "github.com/lulzshadowwalker/zoozie/api/internal/entity"

type (
	CoreFeaturesResponse struct {
		ID          int    `json:"id,omitempty"`
		Name        string `json:"name,omitempty"`
		Description string `json:"description,omitempty"`
		Required    bool   `json:"required,omitempty"`
		DataType    string `json:"dataType,omitempty"`
		Icon        string `json:"icon,omitempty"`
	}
)

func ToCoreFeaturesResponse(feature *entity.CoreFeature) CoreFeaturesResponse {
	return CoreFeaturesResponse{
		ID:          feature.ID,
		Name:        feature.Name,
		Description: feature.Description,
		Required:    feature.Requried,
		DataType:    string(feature.DataType),
		Icon:        feature.Icon,
	}
}
