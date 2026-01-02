<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use App\Http\Requests\CreatePostRequest;
use Flight;

class PostController
{
    public function index()
    {
        $posts = Flight::posts()->all();

        Flight::panel('pages/posts/index', [
            'title' => 'Posts',
            'posts' => $posts
        ]);
    }

    public function create()
    {
        Flight::panel('pages/posts/create', ['title' => 'Create Post']);
    }

    public function store()
    {
        $request = CreatePostRequest::make();
        $files = Flight::request()->getUploadedFiles();
        $coverImage = $files['cover_picture'] ?? null;
        $coverImagePath = null;

        if ($coverImage && $coverImage->getError() === UPLOAD_ERR_OK) {
            $uploadDir = 'public/uploads/';
            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }
            
            $filename = uniqid() . '_' . $coverImage->getClientFilename();
            $coverImage->moveTo($uploadDir . $filename);
            $coverImagePath = '/public/uploads/' . $filename;
        }


        Flight::posts()->create([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'description' => $request->description,
            'tag' => $request->tag,
            'locale' => $request->locale,
            'cover_image' => $coverImagePath,
            'meta_title' => $request->meta_title,
            'meta_description' => $request->meta_description,
            'keywords' => $request->keywords,
            'prevent_indexing' => $request->prevent_indexing ? 1 : 0,
        ]);

        Flight::flash('success', 'Post created successfully.');
        Flight::session()->commit();

        return Flight::redirect('/posts', 303);
    }

    public function destroy(int $id)
    {
        Flight::posts()->delete($id);

        Flight::flash('success', 'Post deleted successfully.');
        Flight::session()->commit();

        return Flight::redirect('/posts', 303);
    }
}
