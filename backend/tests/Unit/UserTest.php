<?php

namespace Tests\Unit;

use PHPUnit\Framework\TestCase;

class UserTest extends TestCase
{
    public function test_user_attributes(): void
    {
        $name = "John Doe";
        $email = "john@example.com";
        
        $this->assertEquals("John Doe", $name);
        $this->assertEquals("john@example.com", $email);
    }

    public function test_user_roles(): void
    {
        $roles = ['student', 'teacher', 'admin'];
        
        $this->assertContains('student', $roles);
        $this->assertCount(3, $roles);
    }
}