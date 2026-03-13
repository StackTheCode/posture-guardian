CREATE TABLE user_settings (
                               id BIGSERIAL PRIMARY KEY,
                               user_id BIGINT NOT NULL UNIQUE,
                               capture_interval_seconds INT DEFAULT 30,
                               notifications_enabled BOOLEAN DEFAULT true,
                               notification_sensitivity VARCHAR(20) DEFAULT 'medium',
                               working_hours_enabled BOOLEAN DEFAULT false,
                               working_hours_start TIME DEFAULT '09:00:00',
                               working_hours_end TIME DEFAULT '17:00:00',
                               camera_index INT DEFAULT 0,
                               theme VARCHAR(20) DEFAULT 'dark',
                               created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                               FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE INDEX idx_user_settings_user_id ON user_settings(user_id);

INSERT INTO user_settings (user_id)
SELECT id FROM users
WHERE id NOT IN (SELECT user_id FROM user_settings);