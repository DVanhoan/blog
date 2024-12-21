<?php

namespace Database\Seeders;

use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class RolePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $roles = ['admin', 'author', 'user'];

        foreach ($roles as $role) {
            Role::updateOrCreate(
                ['name' => $role, 'guard_name' => 'api'],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }


        $permissions = [
            'view-dashboard',
            'create-post',
            'edit-post',
            'delete-post',
            'manage-authors',
            'author-section',
            'create-category',
            'edit-category',
            'delete-category',
            'create-company',
            'edit-company',
            'delete-company'
        ];


        foreach ($permissions as $permission) {
            Permission::updateOrCreate(
                ['name' => $permission, 'guard_name' => 'api'],
                ['created_at' => now(), 'updated_at' => now()]
            );
        }

        $adminRole = Role::where('name', 'admin')->where('guard_name', 'api')->first();
        $allPermissions = Permission::where('guard_name', 'api')->get();
        $adminRole->syncPermissions($allPermissions);

        $authorRole = Role::where('name', 'author')->where('guard_name', 'api')->first();
        $authorPermissions = Permission::whereIn('name', [
            'create-post',
            'edit-post',
            'delete-post',
            'author-section',
            'create-company',
            'edit-company',
            'delete-company'
        ])->where('guard_name', 'api')->get();
        $authorRole->syncPermissions($authorPermissions);
    }
}
