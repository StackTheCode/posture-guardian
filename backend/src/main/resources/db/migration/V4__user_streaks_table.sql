 CREATE TABLE user_streaks(
     id BIGSERIAL PRIMARY KEY,
     user_id BIGINT NOT NULL UNIQUE,
     current_streak INT DEFAULT 0,
     longest_streak INT DEFAULT 0,
     last_activity_date DATE,
     created_at TIMESTAMP DEFAULT  CURRENT_TIMESTAMP,
     updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE

 );

 CREATE INDEX idx_user_streaks_user_id ON user_streaks(user_id);
