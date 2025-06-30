<?php
/**
 * Standalone PHP script to generate password hashes for tb_user table
 * 
 * Usage:
 * 1. Update the $passwords array below with your actual plain text passwords
 * 2. Run: php generate_password_hashes.php
 * 3. Copy the generated SQL statements and run them in your database
 */

// Common plain text passwords used in PLN systems
$passwords = [
    // Administrator accounts
    'admin' => null,
    'administrator' => null,
    '123456' => null,
    'password' => null,
    
    // PLN specific passwords
    'pln123' => null,
    'paiton123' => null,
    'plnuser' => null,
    'performance' => null,
    
    // Simple passwords often used
    '123' => null,
    '1234' => null,
    '12345' => null,
    'test' => null,
    'user' => null,
    'guest' => null,
    
    // Department specific
    'operasi' => null,
    'maintenance' => null,
    'engineering' => null,
    'supervisor' => null,
    
    // Common Indonesian passwords
    'indonesia' => null,
    'jakarta' => null,
    'surabaya' => null,
];

echo "=== Password Hash Generator for tb_user ===\n\n";
echo "Generating bcrypt hashes for PLN Performance Testing System...\n\n";

$sqlStatements = [];

foreach ($passwords as $plainPassword => $hash) {
    // Generate bcrypt hash
    $hashedPassword = password_hash($plainPassword, PASSWORD_BCRYPT);
    
    echo "Plain: {$plainPassword}\n";
    echo "Hash:  {$hashedPassword}\n";
    
    // Generate SQL statement
    $sqlStatement = "UPDATE tb_user SET kode = '{$hashedPassword}' WHERE kode = '{$plainPassword}';";
    $sqlStatements[] = $sqlStatement;
    
    echo "SQL:   {$sqlStatement}\n";
    echo str_repeat('-', 80) . "\n";
}

echo "\n=== Complete SQL Script ===\n\n";
echo "-- Generated on " . date('Y-m-d H:i:s') . "\n";
echo "-- Hash passwords in tb_user table for PLN Performance Testing\n\n";

foreach ($sqlStatements as $sql) {
    echo $sql . "\n";
}

echo "\n-- Check which passwords need hashing first:\n";
echo "SELECT id, nama, kode FROM tb_user WHERE kode NOT LIKE '\$2y\$%';\n\n";

echo "-- Verify the changes after running updates:\n";
echo "SELECT id, nama, LEFT(kode, 30) as hashed_password FROM tb_user;\n\n";

echo "-- Check total users:\n";
echo "SELECT COUNT(*) as total_users FROM tb_user;\n";

echo "\n=== Instructions ===\n";
echo "1. First check which users need password hashing using the SELECT query above\n";
echo "2. Copy the relevant UPDATE statements for your passwords\n";
echo "3. Run them in your database management tool (phpMyAdmin, MySQL Workbench, etc.)\n";
echo "4. Verify that passwords are now hashed using the verification query\n";
echo "5. Test login functionality\n";

echo "\n=== Laravel Artisan Alternative ===\n";
echo "You can also use Laravel Tinker to hash passwords:\n";
echo "php artisan tinker\n";
echo "Hash::make('your_password')\n";

?> 