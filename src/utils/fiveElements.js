import { Solar, Lunar } from 'lunar-javascript';
import { WUXING_MAP, JEWELRY_DB } from '../data/jewelry';

// 五行生克关系
// 生: 木->火->土->金->水->木
// 克: 木->土->水->火->金->木

const GENERATING_MAP = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

// 反向生 (谁生我) - Resource/Mother
const RESOURCE_MAP = {
    '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
};

/**
 * 获取日主 (Day Master)
 * @param {string} birthDateStr 'YYYY-MM-DD'
 * @param {string} birthTimeStr 'HH:mm' (Optional, not used for Day Master but good for future)
 * @returns {string} 天干字符 (e.g., '甲')
 */
export function getDayMaster(birthDateStr) {
    try {
        const date = new Date(birthDateStr);
        // lunar-javascript Solar uses (year, month, day)
        const solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
        const lunar = solar.getLunar();
        return lunar.getDayGan();
    } catch (e) {
        console.error("Error calculating Day Master:", e);
        return null;
    }
}

/**
 * 获取今日能量建议
 * @param {string} birthDateStr
 */
export function getDailyRecommendation(birthDateStr) {
    if (!birthDateStr) return null;

    // 1. User Profile
    const userDayGan = getDayMaster(birthDateStr);
    const userElement = WUXING_MAP[userDayGan];

    // 2. Today's Energy
    const today = new Date();
    const todaySolar = Solar.fromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const todayLunar = todaySolar.getLunar();
    const todayDayGan = todayLunar.getDayGan();
    const todayElement = WUXING_MAP[todayDayGan];

    // 3. Determine Relationship & Recommendation
    let recommendElement = '';
    let reason = '';
    let relation = '';

    // Logic:
    // Same: Resonance -> Recommend Same
    // Today Generates User (Resource): Excess Support -> Recommend Output (Expression)
    // User Generates Today (Output): Draining -> Recommend Resource (Recharge)
    // User Controls Today (Wealth): Consuming -> Recommend Same (Strength)
    // Today Controls User (Power): Pressure -> Recommend Resource (Protection)

    if (userElement === todayElement) {
        // 比肩/劫财 (Same)
        recommendElement = userElement;
        relation = '同频';
        reason = `今日是${todayElement}日，与你能量同频。适合佩戴${userElement}系珠宝，强化个人磁场，自信舒展。`;
    } else if (RESOURCE_MAP[userElement] === todayElement) {
        // 正印/偏印 (Resource Day - Today generates User)
        // Energy is high, express it.
        recommendElement = GENERATING_MAP[userElement];
        relation = '滋养';
        reason = `今日${todayElement}气滋养，能量充盈。适合佩戴${recommendElement}系珠宝，将内心的灵感转化为行动与才华。`;
    } else if (GENERATING_MAP[userElement] === todayElement) {
        // 食神/伤官 (Output Day - User generates Today)
        // Energy is draining.
        recommendElement = RESOURCE_MAP[userElement];
        relation = '释放';
        reason = `今日是释放才华的时刻，易感疲惫。建议佩戴${recommendElement}系珠宝，为你补充能量，保持内心安稳。`;
    } else if (GENERATING_MAP[GENERATING_MAP[userElement]] === todayElement) {
        // 正财/偏财 (Wealth Day - User controls Today)
        // Element -> Output -> Wealth. (e.g. Wood -> Fire -> Earth)
        // Need strength to control wealth.
        recommendElement = userElement;
        relation = '掌控';
        reason = `今日面临机遇与掌控，需要坚定的意志。推荐佩戴${userElement}系珠宝，稳固根基，从容应对。`;
    } else {
        // 正官/七杀 (Power Day - Today controls User)
        // Need protection/bridge. Resource (Mother) bridges Power -> User.
        recommendElement = RESOURCE_MAP[userElement];
        relation = '克制';
        reason = `今日外界能量较强，可能感到压力。适合佩戴${recommendElement}系珠宝，以柔克刚，化解阻力为助力。`;
    }

    const jewelryInfo = JEWELRY_DB[recommendElement];

    return {
        user: {
            dayGan: userDayGan,
            element: userElement
        },
        today: {
            date: todayLunar.toString(),
            ganZhi: `${todayLunar.getYearInGanZhi()}年 ${todayLunar.getMonthInGanZhi()}月 ${todayLunar.getDayInGanZhi()}日`,
            element: todayElement
        },
        recommendation: {
            ...jewelryInfo,
            reason,
            relation
        }
    };
}
