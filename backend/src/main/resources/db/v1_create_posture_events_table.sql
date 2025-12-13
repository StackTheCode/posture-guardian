CREATE TABLE posture_events(
    id BIGSERIAL  PRIMARY KEY,
    user_id BIGINT NOT NULL,
    posture_state VARCHAR(50) NOT NULL,
    confidence DECIMAL(3,2) NOT NULL ,
    severity  DECIMAL(3,2)  NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES  users(id)  ON DELETE CASCADE
);

CREATE INDEX idx_posture_events_user_id ON posture_events(user_id);
CREATE INDEX idx_posture_events_timestamp ON posture_events(timestamp);
CREATE INDEX idx_posture_events_user_timestamp ON posture_events(user_id, timestamp DESC);