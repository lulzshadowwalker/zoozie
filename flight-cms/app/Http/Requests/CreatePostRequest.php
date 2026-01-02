<?php

declare(strict_types=1);

namespace App\Http\Requests;

class CreatePostRequest extends BaseRequest
{
    public function rules(): array
    {
        return [
            'title' => ['required', 'max:255'],
            'slug' => ['required', 'max:255'],
            'content' => ['required'],
            'description' => ['max:500'],
            'tag' => ['max:100'],
            'locale' => ['required', 'max:2'],
            'meta_title' => ['max:255'],
            'meta_description' => ['max:500'],
            'keywords' => ['max:255'],
            'prevent_indexing' => [],
        ];
    }
}
