package com.rk.postguard.dto;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostureEventDto {
private  Long id;

@NotNull
private  String postureState;

@NotNull
private BigDecimal confidence;

@NotNull
private BigDecimal severity;

@NotNull
private LocalDateTime timestamp;


}
