<?php


namespace Tests\Feature;

use Tests\TestCase;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

class AdminControllerTest extends TestCase
{
    use RefreshDatabase;

    protected $admin;
    protected $teacher;

    protected function setUp(): void
    {
        parent::setUp();
        
        $this->admin = User::factory()->create(['role' => 'admin']);
        $this->teacher = User::factory()->create(['role' => 'teacher']);
    }

    /** @test */
    public function admin_can_get_all_users()
    {
        User::factory()->count(5)->create();

        $response = $this->actingAs($this->admin)
            ->getJson('/api/admin/users');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data'
            ]);
    }

    /** @test */
    public function admin_can_create_teacher()
    {
        $response = $this->actingAs($this->admin)
            ->postJson('/api/admin/teachers', [
                'name' => 'New Teacher',
                'email' => 'teacher@example.com',
                'password' => 'password123',
                'password_confirmation' => 'password123'
            ]);

        $response->assertStatus(200)
            ->assertJson(['status' => 'success']);
    }
}