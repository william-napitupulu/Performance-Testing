<?php

use App\Models\User;

test('login screen can be rendered', function () {
    $response = $this->get('/login');

    $response->assertStatus(200);
});

test('users can authenticate using the login screen', function () {
    $user = User::create([
        'id' => 'testuser',
        'nama' => 'Test User',
        'kode' => 'testpassword',
        'plant_id' => 1,
        'status' => 1
    ]);

    $response = $this->post('/login', [
        'username' => $user->id,
        'password' => 'testpassword',
    ]);

    $this->assertAuthenticated();
    $response->assertRedirect(route('dashboard', absolute: false));
});

test('users can not authenticate with invalid password', function () {
    $user = User::create([
        'id' => 'testuser2',
        'nama' => 'Test User 2',
        'kode' => 'testpassword',
        'plant_id' => 2,
        'status' => 1
    ]);

    $this->post('/login', [
        'username' => $user->id,
        'password' => 'wrong-password',
    ]);

    $this->assertGuest();
});

test('users can logout', function () {
    $user = User::create([
        'id' => 'testuser3',
        'nama' => 'Test User 3',
        'kode' => 'testpassword',
        'plant_id' => 1,
        'status' => 1
    ]);

    $response = $this->actingAs($user)->post('/logout');

    $this->assertGuest();
    $response->assertRedirect('/');
});