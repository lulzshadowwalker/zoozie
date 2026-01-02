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

        Flight::posts()->create([
            'title' => $request->title,
            'slug' => $request->slug,
            'content' => $request->content,
            'description' => $request->description,
            'tag' => $request->tag,
            'locale' => $request->locale,
            'cover_image' => $request->cover_image,
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
