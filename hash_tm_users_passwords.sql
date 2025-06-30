-- SQL Script to Hash Passwords in tb_user table
-- WARNING: This is a backup method. Use Laravel commands when possible.

-- First, let's see the current structure of the table
-- DESCRIBE tb_user;

-- Check current passwords (to see which ones need hashing)
-- SELECT id, nama, kode FROM tb_user WHERE kode NOT LIKE '$2y$%';

-- Example of how to hash passwords manually (you'll need to generate hashes using PHP)
-- You can use this PHP code to generate hashes:
/*
<?php
// Generate hashed passwords
$passwords = [
    'plaintext1' => password_hash('plaintext1', PASSWORD_BCRYPT),
    'plaintext2' => password_hash('plaintext2', PASSWORD_BCRYPT),
    // Add more as needed
];

foreach ($passwords as $plain => $hashed) {
    echo "UPDATE tb_user SET kode = '{$hashed}' WHERE kode = '{$plain}';\n";
}
?>
*/

-- Example UPDATE statements (replace with actual values):
-- UPDATE tb_user SET kode = '$2y$10$...' WHERE kode = 'plaintext_password_1';
-- UPDATE tb_user SET kode = '$2y$10$...' WHERE kode = 'plaintext_password_2';

-- After running updates, verify the changes:
-- SELECT id, nama, LEFT(kode, 30) as hashed_password FROM tb_user; 