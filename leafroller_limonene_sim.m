%% Rice Leaf-roller Smart Decision System - Full-season Dynamic Precision Dosing
clear; clc; close all;

% 1. [Daily simulation parameters - adjust as needed]
Input_Month = 8;          % Simulation start month (August)
Initial_Eggs = 100;       % Initial egg density in the field (individuals/m²)
Field_Area_ha = 0.5;      % Field area (ha; e.g. 0.5 ha ≈ 5 fen)
m0_limonene = 1000;       % Base spray volume per application (mL/ha)
v_wind = 0.5;             % Field breeze wind speed (m/s)

% 2. [Core system and experimental parameters]
Threshold = 20;              % Economic injury threshold (individuals/m²)
Limonene_Lethal_Rate = 0.40; % Limonene base lethality (40%)
days_sim = 120;              % Simulation length (days)
T_cel = 28.7;                % Air temperature (°C)

% Module 1: limonene physical evaporation prediction
k_evap = 0.035 * (T_cel/25) * (1 + v_wind);
evap_time_min = (3 * m0_limonene^(1/3)) / k_evap;
Limonene_Duration_Days = ceil(evap_time_min / (24 * 60));

% Module 2: temperature-driven development days and base transition matrix
Days_Egg = 60.2 / (T_cel - 12);
Days_Larva = 240.0 / (T_cel - 11);
Days_Pupa = 84.0 / (T_cel - 14);
s = [0.9, 0.8, 0.9, 0.85];                   % Stage survival rates
P = [1/Days_Egg, 1/Days_Larva, 1/Days_Pupa]; % Stage development rates
f = (200 * 0.5) / 14;                        % Daily fecundity
M_base = [ s(1)*(1-P(1)),  0,               0,               f;
           s(1)*P(1),      s(2)*(1-P(2)),   0,               0;
           0,              s(2)*P(2),       s(3)*(1-P(3)),   0;
           0,              0,               s(3)*P(3),       s(4) ];

% Module 3: no-intervention simulation (for the early-warning report)
pop_base = zeros(4, days_sim);
pop_base(:, 1) = [Initial_Eggs; 0; 0; 0];
for t = 1:days_sim-1
    pop_base(:, t+1) = M_base * pop_base(:, t);
end

fprintf('\nChiayi Minxiong District - Month %d rice leaf-roller outbreak & control advisory\n\n', Input_Month);
fprintf('[Recent 5-yr climate baseline (2021-2025)] (Avg temp: %.1f°C)\n', T_cel);
fprintf('Development timeline prediction (without intervention):\n');
fprintf(' - Egg stage:       about %.1f days to hatch\n', Days_Egg);
fprintf(' - Larval stage:    about %.1f days (main damage period)\n', Days_Larva);
fprintf(' - Pupal stage:     about %.1f days to emerge\n', Days_Pupa);
fprintf(' - Full generation: about %.1f days\n\n', Days_Egg + Days_Larva + Days_Pupa);

first_outbreak_day = find(pop_base(2, :) > Threshold, 1);
fprintf('Risk warning and control overview:\n');
if ~isempty(first_outbreak_day)
    outbreak_larva = pop_base(2, first_outbreak_day);
    fprintf(' - Alert: larvae first exceed the economic threshold on day %d (%.1f individuals/m²).\n', first_outbreak_day, outbreak_larva);
    fprintf(' - Protection: a single spray is expected to last %d day(s) (volatilization decay model).\n\n', Limonene_Duration_Days);
else
    fprintf(' - Safe: larvae stay below the economic threshold (%d individuals/m²) all season.\n\n', Threshold);
end

% Module 4: full-season dynamic intervention (spray schedule and dynamic doses)
pop = zeros(4, days_sim);
pop(:, 1) = [Initial_Eggs; 0; 0; 0];
spray_schedule = [];
dynamic_doses = []; % Dose recorded for each individual spray
cooldown = 0;

for t = 1:days_sim-1
    pop(:, t+1) = M_base * pop(:, t);

    if cooldown > 0
        cooldown = cooldown - 1;
    end

    if pop(2, t+1) > Threshold && cooldown == 0
        spray_schedule = [spray_schedule, t+1];

        % Reduction ratio needed right now to bring larvae down to the threshold
        current_larva = pop(2, t+1);
        reduce_ratio = (current_larva - Threshold) / current_larva;

        % Safety floor: at least half the base lethality, to ensure coverage
        reduce_ratio = max(reduce_ratio, Limonene_Lethal_Rate * 0.5);

        % Total mL for this spray (field area * base volume scaled by ratio)
        current_dose_ml = Field_Area_ha * m0_limonene * (reduce_ratio / Limonene_Lethal_Rate);
        dynamic_doses = [dynamic_doses, current_dose_ml];

        % Apply the lethal effect of the precision spray
        pop(1:2, t+1) = pop(1:2, t+1) * (1 - reduce_ratio);

        cooldown = Limonene_Duration_Days + 5;
    end
end

fprintf('------------------------------------------------------\n');
fprintf('Second-crop rice (120 days) - full-season dynamic spray schedule\n');
fprintf('------------------------------------------------------\n');
if isempty(spray_schedule)
    fprintf(' Good news! Based on the initial count, larvae never exceed the threshold - no spraying needed.\n');
else
    for idx = 1:length(spray_schedule)
        day = spray_schedule(idx);
        generation = ceil(day / (Days_Egg + Days_Larva + Days_Pupa));
        dose_ml = dynamic_doses(idx);
        fprintf(' Spray #%2d: crop day %3d (gen %d) -> recommended mix: %4.0f mL\n', idx, day, generation, dose_ml);
    end

    % Season total
    Total_Season_Dose = sum(dynamic_doses);
    fprintf('\n Total: %d sprays this season; your field (%.1f ha) needs %.0f mL of limonene in total.\n', length(spray_schedule), Field_Area_ha, Total_Season_Dose);
end

% Plot population dynamics
figure('Position', [150, 150, 900, 500]);
plot(1:days_sim, pop(1,:), 'LineWidth', 1.5, 'Color', [0.8500 0.3250 0.0980], 'DisplayName', 'Egg'); hold on;
plot(1:days_sim, pop(2,:), 'LineWidth', 2.5, 'Color', [0.9290 0.6940 0.1250], 'DisplayName', 'Larva (main damage)');
plot(1:days_sim, pop(3,:), 'LineWidth', 1.5, 'Color', [0.4940 0.1840 0.5560], 'DisplayName', 'Pupa');
plot(1:days_sim, pop(4,:), 'LineWidth', 1.5, 'Color', [0 0.4470 0.7410], 'DisplayName', 'Adult');
yline(Threshold, 'r--', 'Economic threshold', 'LineWidth', 2, 'LabelHorizontalAlignment', 'left', 'HandleVisibility', 'off');
for idx = 1:length(spray_schedule)
    x_val = spray_schedule(idx);
    y_val = pop(2, x_val);
    if idx == 1
        plot(x_val, y_val, 'k^', 'MarkerFaceColor', 'r', 'MarkerSize', 10, 'DisplayName', 'Spray event');
    else
        plot(x_val, y_val, 'k^', 'MarkerFaceColor', 'r', 'MarkerSize', 10, 'HandleVisibility', 'off');
    end
    text(x_val, y_val + 12, sprintf('%d', idx), 'FontSize', 9, 'FontWeight', 'bold', 'HorizontalAlignment', 'center');
end
grid on;
title('Rice leaf-roller 120-day dynamics (with dynamic limonene dosing)');
xlabel('Rice growth period (days)'); ylabel('Population (individuals/m²)');
legend('Location', 'northwest');