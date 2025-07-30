@extends('layouts.guest')

@section('content')
    <!-- Session Status -->
    <x-auth-session-status class="mb-4" :status="session('status')" />

    <form method="POST" action="{{ route('login') }}">
        @csrf

        <!-- Email Address -->
        <div>
            <x-input-label for="email" :value="__('Email')" />
            <x-text-input id="email" class="block mt-1 w-full" type="email" name="email" :value="old('email')" required autofocus autocomplete="username" />
            <x-input-error :messages="$errors->get('email')" class="mt-2" />
        </div>

        <!-- Unit -->
        <div class="mt-4">
            <x-input-label for="f_unit_id" :value="__('Unit')" />
            <select id="f_unit_id" name="f_unit_id" class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                <option value="">Select Unit</option>
                @foreach($units as $unit)
                    <option value="{{ $unit->f_unit_id }}" {{ old('f_unit_id') == $unit->f_unit_id ? 'selected' : '' }}>
                        {{ $unit->f_unit_name }}
                    </option>
                @endforeach
            </select>
            <x-input-error :messages="$errors->get('f_unit_id')" class="mt-2" />
        </div>

        <!-- Plant -->
        <div class="mt-4">
            <x-input-label for="f_plant_id" :value="__('Plant')" />
            <select id="f_plant_id" name="f_plant_id" class="block mt-1 w-full border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 rounded-md shadow-sm" required>
                <option value="">Select Plant</option>
                @foreach($plants as $plant)
                    <option value="{{ $plant->f_plant_id }}" {{ old('f_plant_id') == $plant->f_plant_id ? 'selected' : '' }}>
                        {{ $plant->f_plant_name }}
                    </option>
                @endforeach
            </select>
            <x-input-error :messages="$errors->get('f_plant_id')" class="mt-2" />
        </div>

        <!-- Password -->
        <div class="mt-4">
            <x-input-label for="password" :value="__('Password')" />
            <x-text-input id="password" class="block mt-1 w-full" type="password" name="password" required autocomplete="current-password" />
            <x-input-error :messages="$errors->get('password')" class="mt-2" />
        </div>

        <!-- Remember Me -->
        <div class="block mt-4">
            <label for="remember_me" class="inline-flex items-center">
                <input id="remember_me" type="checkbox" class="rounded border-gray-300 text-indigo-600 shadow-sm focus:ring-indigo-500" name="remember">
                <span class="ms-2 text-sm text-gray-600">{{ __('Remember me') }}</span>
            </label>
        </div>

        <div class="flex items-center justify-end mt-4">
            @if (Route::has('password.request'))
                <a class="underline text-sm text-gray-600 hover:text-gray-900 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" href="{{ route('password.request') }}">
                    {{ __('Forgot your password?') }}
                </a>
            @endif

            <x-primary-button class="ms-3">
                {{ __('Log in') }}
            </x-primary-button>
        </div>
    </form>
@endsection 