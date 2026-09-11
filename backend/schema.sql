
CREATE EXTENSION IF NOT EXISTS "pgcrypto"; 


CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) NOT NULL UNIQUE,
    firstname       VARCHAR(100) NOT NULL,
    lastname        VARCHAR(100) NOT NULL,
    description     TEXT,
    password_hash   VARCHAR(255) NOT NULL,
    avatar_url      VARCHAR(500),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE workspaces (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    description     TEXT,
    owner_id        UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE workspace_role AS ENUM ('owner', 'admin', 'member', 'viewer');

CREATE TABLE workspace_members (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role            workspace_role NOT NULL DEFAULT 'member',
    joined_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (workspace_id, user_id)
);

CREATE TABLE workspace_invitations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    email           VARCHAR(250) NOT NULL,
    role            workspace_role NOT NULL DEFAULT 'member',
    invited_by      UUID NOT NULL REFERENCES users(id),
    token           TEXT NOT NULL UNIQUE,
    accepted_at     TIMESTAMPTZ,
    expires_at      TIMESTAMPTZ NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE projects (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    key             VARCHAR(250) NOT NULL,
    description     TEXT,
    is_archived     BOOLEAN NOT NULL DEFAULT false,
    task_seq        INTEGER NOT NULL DEFAULT 0, 
    created_by      UUID NOT NULL REFERENCES users(id),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (workspace_id, key)
);

CREATE TABLE boards (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    position        DOUBLE PRECISION NOT NULL DEFAULT 0,
    is_archived     BOOLEAN NOT NULL DEFAULT false,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');
CREATE TABLE board_lists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    board_id        UUID NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    position        DOUBLE PRECISION NOT NULL,
    status          task_status NOT NULL DEFAULT 'todo',
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'urgent');
CREATE TABLE tasks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    list_id         UUID NOT NULL REFERENCES board_lists(id) ON DELETE CASCADE,
    number          INTEGER NOT NULL, 
    title           VARCHAR(100) NOT NULL,
    description     TEXT,
    position        DOUBLE PRECISION NOT NULL,
    priority        task_priority NOT NULL DEFAULT 'medium',
    due_date        TIMESTAMPTZ,
    is_completed    BOOLEAN NOT NULL DEFAULT false,
    completed_at    TIMESTAMPTZ,
    created_by      UUID NOT NULL REFERENCES users(id),
    metadata        JSONB NOT NULL DEFAULT '{}'::jsonb, 
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (project_id, number)
);

CREATE OR REPLACE FUNCTION set_task_number()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE projects SET task_seq = task_seq + 1 WHERE id = NEW.project_id
    RETURNING task_seq INTO NEW.number;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_set_task_number
BEFORE INSERT ON tasks
FOR EACH ROW
WHEN (NEW.number IS NULL)
EXECUTE FUNCTION set_task_number();

CREATE TABLE task_assignees (
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assigned_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (task_id, user_id)
);

CREATE TYPE dependency_type AS ENUM ('blocks', 'relates_to', 'duplicates');

CREATE TABLE task_dependencies (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id             UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    depends_on_task_id  UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    type                dependency_type NOT NULL DEFAULT 'blocks',
    CHECK (task_id <> depends_on_task_id),
    UNIQUE (task_id, depends_on_task_id, type)
);



CREATE TABLE labels (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id      UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name            VARCHAR(100) NOT NULL,
    color           TEXT NOT NULL DEFAULT '#999999',
    UNIQUE (project_id, name)
);

CREATE TABLE task_labels (
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    label_id        UUID NOT NULL REFERENCES labels(id) ON DELETE CASCADE,
    PRIMARY KEY (task_id, label_id)
);


CREATE TABLE checklists (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    title           VARCHAR(100) NOT NULL DEFAULT 'Checklist',
    position        DOUBLE PRECISION NOT NULL DEFAULT 0
);

CREATE TABLE checklist_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    checklist_id    UUID NOT NULL REFERENCES checklists(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    is_checked      BOOLEAN NOT NULL DEFAULT false,
    position        DOUBLE PRECISION NOT NULL DEFAULT 0
);


CREATE TABLE comments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content         TEXT NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE attachments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    task_id         UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
    uploaded_by     UUID NOT NULL REFERENCES users(id),
    file_url        TEXT NOT NULL,
    file_name       VARCHAR(100) NOT NULL,
    file_size       BIGINT,
    mime_type       VARCHAR(100) NOT NULL,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);


CREATE TABLE activity_log (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE,
    task_id         UUID REFERENCES tasks(id) ON DELETE CASCADE,
    user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
    action_type     TEXT NOT NULL, 
    details         JSONB NOT NULL DEFAULT '{}'::jsonb, 
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);



CREATE INDEX idx_workspace_members_user      ON workspace_members(user_id);
CREATE INDEX idx_workspace_members_workspace ON workspace_members(workspace_id);
CREATE INDEX idx_projects_workspace          ON projects(workspace_id);
CREATE INDEX idx_boards_project              ON boards(project_id);
CREATE INDEX idx_board_lists_board           ON board_lists(board_id);
CREATE INDEX idx_tasks_list                  ON tasks(list_id);
CREATE INDEX idx_tasks_project               ON tasks(project_id);
CREATE INDEX idx_tasks_due_date              ON tasks(due_date) WHERE is_completed = false;
CREATE INDEX idx_task_assignees_user         ON task_assignees(user_id);
CREATE INDEX idx_comments_task               ON comments(task_id);
CREATE INDEX idx_activity_log_workspace      ON activity_log(workspace_id, created_at DESC);
CREATE INDEX idx_activity_log_project        ON activity_log(project_id, created_at DESC);


CREATE OR REPLACE FUNCTION touch_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_touch_users      BEFORE UPDATE ON users      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_workspaces BEFORE UPDATE ON workspaces FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_projects   BEFORE UPDATE ON projects   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_boards     BEFORE UPDATE ON boards     FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_tasks      BEFORE UPDATE ON tasks      FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_comments   BEFORE UPDATE ON comments   FOR EACH ROW EXECUTE FUNCTION touch_updated_at();


CREATE TABLE block_types (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key             TEXT NOT NULL UNIQUE, 
    name            VARCHAR(100) NOT NULL,
    description     TEXT,
    icon            VARCHAR(250),
    config_schema   JSONB NOT NULL DEFAULT '{}'::jsonb, 
    is_active       BOOLEAN NOT NULL DEFAULT true,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE sections (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workspace_id    UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    project_id      UUID REFERENCES projects(id) ON DELETE CASCADE, 
    name            TEXT NOT NULL,
    slug            TEXT NOT NULL,
    icon            TEXT,
    position        DOUBLE PRECISION NOT NULL DEFAULT 0,
    created_by      UUID NOT NULL REFERENCES users(id),
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (workspace_id, slug)
);

CREATE TABLE section_blocks (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id      UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
    block_type_id   UUID NOT NULL REFERENCES block_types(id) ON DELETE RESTRICT,
    title           VARCHAR(100) NOT NULL, 
    config          JSONB NOT NULL DEFAULT '{}'::jsonb,
    pos_x           INTEGER NOT NULL DEFAULT 0, 
    pos_y           INTEGER NOT NULL DEFAULT 0,
    width           INTEGER NOT NULL DEFAULT 4,
    height          INTEGER NOT NULL DEFAULT 3,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_sections_workspace       ON sections(workspace_id);
CREATE INDEX idx_section_blocks_section   ON section_blocks(section_id);

CREATE TRIGGER trg_touch_sections       BEFORE UPDATE ON sections       FOR EACH ROW EXECUTE FUNCTION touch_updated_at();
CREATE TRIGGER trg_touch_section_blocks BEFORE UPDATE ON section_blocks FOR EACH ROW EXECUTE FUNCTION touch_updated_at();