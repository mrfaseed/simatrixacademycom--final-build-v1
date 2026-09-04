<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::create('admins', function (Blueprint $t) { $t->id(); $t->string('name',120); $t->string('email',120)->unique(); $t->string('password_hash'); $t->string('role',40)->default('admin'); $t->dateTime('created_at')->nullable(); });
        Schema::create('course_categories', function (Blueprint $t) { $t->id(); $t->string('name',120); $t->string('slug',140)->unique(); $t->text('description')->nullable(); $t->string('icon',60)->nullable(); $t->integer('order')->default(0); });
        Schema::create('courses', function (Blueprint $t) { $t->id(); $t->foreignId('category_id')->constrained('course_categories')->cascadeOnDelete(); $t->string('title',160); $t->string('slug',180)->unique(); $t->string('summary',300)->nullable(); $t->text('description')->nullable(); $t->string('duration',60)->nullable(); $t->string('level',60)->nullable(); $t->string('tier',40)->default('classic'); $t->longText('syllabus')->nullable(); $t->longText('roadmap')->nullable(); $t->longText('designations')->nullable(); $t->longText('quiz')->nullable(); $t->string('image')->nullable(); $t->boolean('is_active')->default(true); $t->integer('order')->default(0); });
        Schema::create('branches', function (Blueprint $t) { $t->id(); $t->string('name',120); $t->string('city',80); $t->text('address')->nullable(); $t->string('phone',120)->nullable(); $t->string('email',120)->nullable(); $t->string('hours',200)->nullable(); $t->text('map_embed')->nullable(); $t->boolean('is_primary')->default(false); $t->integer('order')->default(0); });
        Schema::create('testimonials', function (Blueprint $t) { $t->id(); $t->string('name',120); $t->string('role',160)->nullable(); $t->text('content'); $t->integer('rating')->default(5); $t->string('image')->nullable(); $t->boolean('is_active')->default(true); $t->integer('order')->default(0); });
        Schema::create('features', function (Blueprint $t) { $t->id(); $t->string('title',160); $t->text('description')->nullable(); $t->string('icon',60)->nullable(); $t->integer('order')->default(0); });
        Schema::create('blog_posts', function (Blueprint $t) { $t->id(); $t->string('title',200); $t->string('slug',220)->unique(); $t->string('excerpt',400)->nullable(); $t->longText('content')->nullable(); $t->string('image')->nullable(); $t->string('author',120)->default('Simatrix Academy'); $t->string('tag',80)->nullable(); $t->boolean('is_published')->default(true); $t->dateTime('created_at')->nullable(); });
        Schema::create('gallery_images', function (Blueprint $t) { $t->id(); $t->string('title',160)->nullable(); $t->string('image'); $t->string('category',80)->nullable(); $t->integer('order')->default(0); $t->dateTime('created_at')->nullable(); });
        Schema::create('awards', function (Blueprint $t) { $t->id(); $t->string('title',200); $t->string('issuer',160)->nullable(); $t->string('year',10)->nullable(); $t->text('description')->nullable(); $t->string('image')->nullable(); $t->integer('order')->default(0); });
        Schema::create('settings', function (Blueprint $t) { $t->string('key',80)->primary(); $t->text('value')->nullable(); });
        Schema::create('enquiries', function (Blueprint $t) { $t->id(); $t->string('name',120); $t->string('email',120)->nullable(); $t->string('phone',40); $t->foreignId('course_id')->nullable()->constrained('courses')->nullOnDelete(); $t->foreignId('branch_id')->nullable()->constrained('branches')->nullOnDelete(); $t->text('message')->nullable(); $t->string('college',150)->nullable(); $t->text('address')->nullable(); $t->string('degree',120)->nullable(); $t->string('type',40)->default('contact'); $t->string('status',40)->default('new'); $t->foreignId('assigned_to')->nullable()->constrained('admins')->nullOnDelete(); $t->dateTime('follow_up_at')->nullable(); $t->dateTime('created_at')->nullable(); });
        Schema::create('enquiry_notes', function (Blueprint $t) { $t->id(); $t->foreignId('enquiry_id')->constrained('enquiries')->cascadeOnDelete(); $t->foreignId('admin_id')->nullable()->constrained('admins')->nullOnDelete(); $t->string('admin_name',120)->nullable(); $t->text('body'); $t->dateTime('created_at')->nullable(); });
        Schema::create('activity_logs', function (Blueprint $t) { $t->id(); $t->unsignedBigInteger('admin_id')->nullable(); $t->string('admin_name',120)->nullable(); $t->string('action'); $t->string('entity',80)->nullable(); $t->dateTime('created_at')->nullable(); });
    }
    public function down(): void
    {
        foreach (['activity_logs','enquiry_notes','enquiries','settings','awards','gallery_images','blog_posts','features','testimonials','branches','courses','course_categories','admins'] as $table) Schema::dropIfExists($table);
    }
};
