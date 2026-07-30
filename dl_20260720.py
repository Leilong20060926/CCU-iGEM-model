from datetime import datetime
from io import StringIO
from pathlib import Path
import tkinter as tk
from tkinter import simpledialog

import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt

# Use a font fallback that is available in most environments.
plt.rcParams["font.family"] = ["DejaVu Sans", "sans-serif"]


def simulate(month: int, initial_eggs: float, output_dir: str | None = None) -> str:
    # 1. 嘉義地區歷史月均溫 (7~10月)
    temp_5yr_db = [29.1, 28.7, 28.3, 26.2]  # 近五年 (2021-2025)
    temp_10yr_db = [29.2, 28.8, 28.3, 26.1]  # 近十年 (2016-2025)

    if month < 7 or month > 10:
        raise ValueError("目前僅支援 7 到 10 月的二期作數據模擬")

    # 2. 危害標準 (來自文獻)
    # 每叢 1 隻幼蟲 = 每平方公尺 20 隻幼蟲
    threshold = 20

    # ！！以下為【需要修改】的檸檬烯實驗假設數據！！
    # 假設 1：標準噴灑量為「每公頃 1000 毫升 (1 公升)」的 10% 檸檬烯水溶液
    standard_dose_ml_per_ha = 1000
    # 假設 2：噴灑標準劑量後，幼蟲存活率會下降多少？(假設致死率 40%)
    limonene_lethal_rate = 0.40
    # 假設 3：藥效可以持續幾天？(精油易揮發，假設有效天數為 5 天)
    limonene_duration_days = 5

    scenarios = ["近五年氣候基準 (2021-2025)", "近十年氣候基準 (2016-2025)"]
    temp_scenarios = [temp_5yr_db[month - 7], temp_10yr_db[month - 7]]

    output = StringIO()
    print(f"嘉義民雄地區 {month} 月份 瘤野螟爆發與防治建議 \n", file=output)

    for i in range(2):
        t = temp_scenarios[i]
        scenario_name = scenarios[i]

        # 模組一：無外力狀況下的發育天數預測
        days_egg = 60.2 / (t - 12)
        days_larva = 240.0 / (t - 11)
        days_pupa = 84.0 / (t - 14)

        print(f"【{scenario_name}】(平均氣溫: {t:.1f}℃)", file=output)
        print(" 發育時程預測 (無外力介入):", file=output)
        print(f" - 卵期需約： {days_egg:.1f} 天孵化為幼蟲", file=output)
        print(f" - 幼蟲期約： {days_larva:.1f} 天 (主要危害期)", file=output)
        print(f" - 蛹期需約： {days_pupa:.1f} 天羽化為成蟲", file=output)
        print(f" - 完整世代： 約 {days_egg + days_larva + days_pupa:.1f} 天\n", file=output)

        # 模組二：族群爆發模擬與用藥建議
        days_sim = 60
        s = [0.9, 0.8, 0.9, 0.85]
        p = [1 / days_egg, 1 / days_larva, 1 / days_pupa]
        f = (200 * 0.5) / 14

        m_base = [
            [s[0] * (1 - p[0]), 0, 0, f],
            [s[0] * p[0], s[1] * (1 - p[1]), 0, 0],
            [0, s[1] * p[1], s[2] * (1 - p[2]), 0],
            [0, 0, s[2] * p[2], s[3]],
        ]

        pop = [[0.0] * days_sim for _ in range(4)]
        pop[0][0] = initial_eggs

        for t_idx in range(days_sim - 1):
            next_pop = [0.0, 0.0, 0.0, 0.0]
            for row in range(4):
                total = 0.0
                for col in range(4):
                    total += m_base[row][col] * pop[col][t_idx]
                next_pop[row] = total
            for row in range(4):
                pop[row][t_idx + 1] = next_pop[row]

        max_larva_value = max(pop[1])
        peak_day = pop[1].index(max_larva_value) + 1

        print(" 危害預警與防治建議:", file=output)
        print(f" - 預估田間將於第 {peak_day} 天出現幼蟲高峰，數量達 {max_larva_value:.1f} 隻/平方公尺。", file=output)

        if max_larva_value > threshold:
            print(f" - 警告：幼蟲數量已超過經濟危害基準 ({threshold} 隻/m²)！", file=output)

            reduce_ratio_needed = (max_larva_value - threshold) / max_larva_value
            dose_multiplier = reduce_ratio_needed / limonene_lethal_rate
            recommend_dose = standard_dose_ml_per_ha * dose_multiplier

            print(" - 系統建議行動：", file=output)
            print(f"   > 建議於第 {round(days_egg)} 天 (卵即將大量孵化時) 進行噴灑。", file=output)
            print(f"   > 建議檸檬烯最低施用劑量： {recommend_dose:.0f} 毫升 / 每公頃。", file=output)
            print(f"   > 預期防護力可持續 {limonene_duration_days} 天 (根據揮發衰減模型)。\n", file=output)
        else:
            print(f" - 安全：最高幼蟲量未超過危害基準 ({threshold} 隻/m²)。", file=output)
            print("   > 系統建議：目前無需施用檸檬烯，持續觀察即可。", file=output)

    print("總結：若兩氣候基準建議之用藥時機不同，建議以「近五年氣候基準」為主要決策依據。", file=output)

    text_output = output.getvalue()
    print(text_output)

    if output_dir is not None:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)

        plt.figure(figsize=(10, 5))
        plt.plot(range(1, days_sim + 1), pop[1], label="Larvae", color="tab:red")
        plt.axvline(peak_day, color="gray", linestyle="--", label=f"Peak day {peak_day}")
        plt.axhline(threshold, color="tab:orange", linestyle=":", label=f"Threshold {threshold}")
        title_name = "recent_5yr" if i == 0 else "recent_10yr"
        plt.title(f"{title_name} - Larval population trend")
        plt.xlabel("Days")
        plt.ylabel("Population (individuals/m²)")
        plt.grid(True, alpha=0.3)
        plt.legend()
        plt.tight_layout()
        plt.savefig(output_path / f"population_{title_name}.png", dpi=200)
        plt.close()

    if output_dir is not None:
        output_path = Path(output_dir)
        output_path.mkdir(parents=True, exist_ok=True)
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        report_path = output_path / f"simulation_result_{timestamp}.txt"
        report_path.write_text(text_output, encoding="utf-8")

    return text_output


def main() -> None:
    root = tk.Tk()
    root.withdraw()

    month = simpledialog.askinteger("輸入參數", "請輸入月份 (7~10):", initialvalue=8, minvalue=7, maxvalue=10)
    if month is None:
        print("使用者取消輸入，結束程式。")
        return

    initial_eggs = simpledialog.askfloat("輸入參數", "請輸入初始卵數量 (每平方公尺):", initialvalue=100, minvalue=0)
    if initial_eggs is None:
        print("使用者取消輸入，結束程式。")
        return

    output_dir = simpledialog.askstring("輸入參數", "請輸入圖表輸出資料夾 (預設: plots):", initialvalue="plots")
    if output_dir is None or output_dir == "":
        output_dir = "plots"

    simulate(month, initial_eggs, output_dir)
    root.destroy()


if __name__ == "__main__":
    main()
