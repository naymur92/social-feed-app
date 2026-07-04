<?php

namespace Database\Seeders;

use App\Models\Comment;
use App\Models\Like;
use App\Models\Post;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    public function run(): void
    {
        // users
        $naymur = User::create([
            'first_name' => 'Naymur Rahman',
            'last_name'  => 'Rahman',
            'email'      => 'naymur@example.com',
            'password'   => Hash::make('password'),
        ]);

        $kamrul = User::create([
            'first_name' => 'Kamrul',
            'last_name'  => 'Islam',
            'email'      => 'kamrul@example.com',
            'password'   => Hash::make('password'),
        ]);

        $umar = User::create([
            'first_name' => 'Muhammad',
            'last_name'  => 'Umar',
            'email'      => 'umar@example.com',
            'password'   => Hash::make('password'),
        ]);

        // posts
        $publicPost = Post::create([
            'user_id'    => $naymur->id,
            'content'    => 'Hello, Assalamu alaikum. This is my first post.',
            'visibility' => 'public',
        ]);

        $privatePost = Post::create([
            'user_id'    => $naymur->id,
            'content'    => 'Test private post.',
            'visibility' => 'private',
        ]);

        $kamrulPost = Post::create([
            'user_id'    => $kamrul->id,
            'content'    => 'Excited to share my first post!',
            'visibility' => 'public',
        ]);

        // comments & replies
        $comment = Comment::create([
            'user_id' => $kamrul->id,
            'post_id' => $publicPost->id,
            'body'    => 'Welcome to the community!',
        ]);

        $reply = Comment::create([
            'user_id'   => $naymur->id,
            'post_id'   => $publicPost->id,
            'parent_id' => $comment->id,
            'body'      => 'Thanks!',
        ]);

        // likes (post, comment, reply)
        Like::create(['user_id' => $naymur->id, 'likeable_type' => Post::class,    'likeable_id' => $publicPost->id]);
        Like::create(['user_id' => $kamrul->id,  'likeable_type' => Post::class,    'likeable_id' => $publicPost->id]);
        Like::create(['user_id' => $umar->id, 'likeable_type' => Comment::class, 'likeable_id' => $comment->id]);
        Like::create(['user_id' => $kamrul->id, 'likeable_type' => Comment::class, 'likeable_id' => $reply->id]);
    }
}
