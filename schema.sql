<<<<<<< HEAD
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents Table
create table if not exists documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  content text,
  "order" integer default 0,
  parent_id uuid references documents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assets Table
create table if not exists assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  type text not null, -- 'text', 'audio', 'video'
  url text,
  processed_text text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Settings Table (for API Keys)
create table if not exists user_settings (
  user_id uuid references auth.users(id) primary key,
  gemini_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table projects enable row level security;
alter table documents enable row level security;
alter table assets enable row level security;
alter table user_settings enable row level security;

-- Projects Policies
create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- User Settings Policies
create policy "Users can view their own settings" on user_settings
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own settings" on user_settings
  for all using (auth.uid() = user_id);
=======
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Projects Table
create table if not exists projects (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) not null,
  title text not null,
  description text,
  settings jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Documents Table
create table if not exists documents (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  title text not null,
  content text,
  "order" integer default 0,
  parent_id uuid references documents(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Assets Table
create table if not exists assets (
  id uuid default uuid_generate_v4() primary key,
  project_id uuid references projects(id) on delete cascade not null,
  type text not null, -- 'text', 'audio', 'video'
  url text,
  processed_text text,
  tags text[],
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- User Settings Table (for API Keys)
create table if not exists user_settings (
  user_id uuid references auth.users(id) primary key,
  gemini_api_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS Policies
alter table projects enable row level security;
alter table documents enable row level security;
alter table assets enable row level security;
alter table user_settings enable row level security;

-- Projects Policies
create policy "Users can view their own projects" on projects
  for select using (auth.uid() = user_id);

create policy "Users can insert their own projects" on projects
  for insert with check (auth.uid() = user_id);

create policy "Users can update their own projects" on projects
  for update using (auth.uid() = user_id);

create policy "Users can delete their own projects" on projects
  for delete using (auth.uid() = user_id);

-- User Settings Policies
create policy "Users can view their own settings" on user_settings
  for select using (auth.uid() = user_id);

create policy "Users can insert/update their own settings" on user_settings
  for all using (auth.uid() = user_id);
>>>>>>> 203a113f90e040fa36f74925daaade94739e0d14
