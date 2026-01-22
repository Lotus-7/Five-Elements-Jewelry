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
 * @param {string} birthTimeStr 'HH:mm' (Optional)
 * @returns {object} { dayGan: '甲', hourGan: '丙', timeWeight: boolean }
 */
export function getDayMaster(birthDateStr, birthTimeStr = '') {
    try {
        const date = new Date(birthDateStr);
        let solar;

        // 如果有时间，设置时辰
        if (birthTimeStr) {
            const [hour, minute] = birthTimeStr.split(':').map(Number);
            solar = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute, 0);
        } else {
            solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
        }

        const lunar = solar.getLunar();

        return {
            dayGan: lunar.getDayGan(),
            hourGan: birthTimeStr ? lunar.getTimeGan() : null,
            timeProvided: !!birthTimeStr
        };
    } catch (e) {
        console.error("Error calculating Day Master:", e);
        return null;
    }
}

/**
 * 获取今日能量建议
 * @param {string} birthDateStr
 * @param {string} birthTimeStr (Optional)
 */
export function getDailyRecommendation(birthDateStr, birthTimeStr = '') {
    if (!birthDateStr) return null;

    // 1. User Profile
    const userProfile = getDayMaster(birthDateStr, birthTimeStr);

    if (!userProfile) {
        console.error("Failed to calculate User Profile");
        return null;
    }

    const userDayGan = userProfile.dayGan;
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

    // Base Logic (Day Pillar):
    // Same: Resonance -> Recommend Same
    // Today Generates User (Resource): Excess Support -> Recommend Output (Expression)
    // User Generates Today (Output): Draining -> Recommend Resource (Recharge)
    // User Controls Today (Wealth): Consuming -> Recommend Same (Strength)
    // Today Controls User (Power): Pressure -> Recommend Resource (Protection)

    if (userElement === todayElement) {
        recommendElement = userElement;
        relation = '同频';
        reason = `今日是${todayElement}日，与你能量同频。适合佩戴${userElement}系珠宝，强化个人磁场，自信舒展。`;
    } else if (RESOURCE_MAP[userElement] === todayElement) {
        recommendElement = GENERATING_MAP[userElement];
        relation = '滋养';
        reason = `今日${todayElement}气滋养，能量充盈。适合佩戴${recommendElement}系珠宝，将内心的灵感转化为行动与才华。`;
    } else if (GENERATING_MAP[userElement] === todayElement) {
        recommendElement = RESOURCE_MAP[userElement];
        relation = '释放';
        reason = `今日是释放才华的时刻，易感疲惫。建议佩戴${recommendElement}系珠宝，为你补充能量，保持内心安稳。`;
    } else if (GENERATING_MAP[GENERATING_MAP[userElement]] === todayElement) {
        recommendElement = userElement;
        relation = '掌控';
        reason = `今日面临机遇与掌控，需要坚定的意志。推荐佩戴${userElement}系珠宝，稳固根基，从容应对。`;
    } else {
        recommendElement = RESOURCE_MAP[userElement];
        relation = '克制';
        reason = `今日外界能量较强，可能感到压力。适合佩戴${recommendElement}系珠宝，以柔克刚，化解阻力为助力。`;
    }

    // 4. Time Pillar Adjustment (If provided)
    // 简单逻辑：如果时辰五行 克 日主，建议增强印（Resource）
    // 如果时辰五行 生 日主，建议增强食伤（Output）或财（Wealth）
    if (userProfile.timeProvided && userProfile.hourGan) {
        const hourElement = WUXING_MAP[userProfile.hourGan];

        // 如果时柱克日主 (Power at Hour)，压力较大，强制建议用印（生我者）化解
        if (hourElement === GENERATING_MAP[GENERATING_MAP[userElement]] || // Wealth (consumes me to control) - slight stretch
            GENERATING_MAP[hourElement] === userElement // Power (controls me) - direct
        ) {
            // Only override if current recommendation is NOT Resource
            if (recommendElement !== RESOURCE_MAP[userElement]) {
                recommendElement = RESOURCE_MAP[userElement];
                reason += ` 结合出生时辰，今日更需${RESOURCE_MAP[userElement]}系能量护持，平稳心神。`;
                relation = '护持';
            }
        }

        // 如果时柱生日主 (Resource at Hour)，身强，鼓励克泄（Output/Wealth/Power）
        if (hourElement === RESOURCE_MAP[userElement]) {
            // If currently recommending Resource, switch to Output to balance "Too much Resource"
            if (recommendElement === RESOURCE_MAP[userElement]) {
                recommendElement = GENERATING_MAP[userElement];
                reason += ` 时柱印星得力，能量充沛，不妨佩戴${recommendElement}系珠宝，大胆展现自我。`;
                relation = '绽放';
            }
        }
    }

    const jewelryInfo = JEWELRY_DB[recommendElement];

    return {
        user: {
            dayGan: userDayGan,
            element: userElement,
            hourGan: userProfile.hourGan
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
