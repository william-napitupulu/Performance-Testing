<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('tb_um_users')->insert([
            'f_user_id' => 52,
            'f_full_name' => 'BHAKTI PRASTYAWAN',
            'f_user_name' => '7494015JA',
            'f_password' => Hash::make('7494015ja@ptpjb.com'),
            'f_email' => '7494015ja@ptpjb.com',
            'f_image_profile' => '/files/userprofile/user.jpg',
            'f_division' => null,
            'f_plant_id' => 1,
            'f_role_id' => 1,
            'f_position_id' => null,
            'f_failed_counter' => 0,
            'f_locked_time' => null,
            'f_udf1' => null,
            'f_udf2' => null,
            'f_udf3' => null,
            'f_udf4' => null,
            'f_udf5' => null,
            'f_is_active' => 1,
            'f_updated_at' => '2021-03-18 13:58:46',
            'f_image_path' => null,
            'f_nik' => '7494015JA',
            'f_login_status_mobile' => 1,
            'f_login_status_web' => 1,
            'f_login_status_web_pln' => 1,
            'f_token_web' => 'eyJhbGciOiJIUzUxMiJ9.eyJleHAiOjE3NDk1NDI4MjQsInByaXZpbGVnZXMiOltdLCJyb2xlcyI6W10sInN1YiI6Ijc0OTQwMTVKQSJ9.v6hse0fvJ6d2Un-bfAkaZLDs4uhOuC8uvsOwJvSTWVFsqoAyZ5gYqTcZyecUCr9AlpaO3FfutQsxvnNFsczoRQ',
            'f_token_mobile' => null,
            'f_token_pln' => 'mjtf0uYgNWTCOds5N4m2fKZXwwwm4FUWg86HRgJbEfhw_vyv2ymsqqOp_cvi_MRUBGbSesARt6fxJvaQ',
            'f_is_securepass' => null,
            'f_is_login_status_svm' => null,
            'f_token_svm' => null,
        ]);
    }
} 