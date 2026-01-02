<?php

declare(strict_types=1);

namespace App\Http\Controllers;

use Flight;

class AuthController
{
    public function login()
    {
        if (Flight::session()->get('user_id')) {
            Flight::redirect('/');
        }

        Flight::render('pages/auth/login', [], 'content');
        Flight::render('layouts/auth', ['title' => 'Sign in']);
    }

    public function authenticate()
    {
        $data = Flight::request()->data;
        $email = $data->email;
        $password = $data->password;

        if (!$email || !$password) {
            Flight::flash('errors', ['login' => 'Email and password are required']);
            Flight::flash('old', ['email' => $email]);
            Flight::redirect('/login');
        }

        $user = Flight::user()->findByEmail($email);

        if (!$user || !password_verify($password, $user['password'])) {
            Flight::flash('errors', ['login' => 'Invalid email or password']);
            Flight::flash('old', ['email' => $email]);
            Flight::redirect('/login');
        }

        Flight::session()->regenerate(true);
        Flight::session()->set('user_id', $user['id']);
        Flight::session()->set('user_name', $user['name']);
        Flight::session()->set('user_email', $user['email']);
        Flight::redirect('/');
    }

    public function logout()
    {
        Flight::session()->clear();
        Flight::session()->regenerate(true);

        Flight::redirect('/login');
    }
}
