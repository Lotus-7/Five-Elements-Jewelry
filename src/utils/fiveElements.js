import { Solar, Lunar } from 'lunar-javascript';
import { WUXING_MAP, JEWELRY_DB } from '../data/jewelry';

// 五行相生关系：木 -> 火 -> 土 -> 金 -> 水 -> 木
const GENERATING_MAP = {
    '木': '火', '火': '土', '土': '金', '金': '水', '水': '木'
};

// 五行相生反向关系（谁生我，即印星关系）：木 <- 水, 火 <- 木, 土 <- 火, 金 <- 土, 水 <- 金
const RESOURCE_MAP = {
    '木': '水', '火': '木', '土': '火', '金': '土', '水': '金'
};

/**
 * 核心命理算法：计算八字五行强弱与喜忌
 * @param {object} bazi 八字天干地支对象
 * @param {boolean} hasTime 是否提供了时辰
 * @returns {object} 五行分析结果（得分、身强/身弱、喜用神）
 */
function analyzeBaziStrength(bazi, hasTime) {
    // 天干对应的五行
    const STEM_ELEMENT = {
        '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土', '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水'
    };
    // 地支对应的本气五行
    const BRANCH_ELEMENT = {
        '寅': '木', '卯': '木', '辰': '土', '巳': '火', '午': '火', '未': '土', '申': '金', '酉': '金', '戌': '土', '亥': '水', '子': '水', '丑': '土'
    };

    // 初始化五行得分
    const scores = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    const dayMaster = bazi.dayGan;
    const dayMasterElement = STEM_ELEMENT[dayMaster];

    // 定义八字各位置的能量权重（月令/月支权重最高，主导全局能量）
    const weights = hasTime ? {
        yearGan: 10,   // 年干
        yearZhi: 10,   // 年支
        monthGan: 12,  // 月干
        monthZhi: 40,  // 月支（月令，核心权重，占比40%）
        dayZhi: 12,    // 日支（夫妻宫）
        hourGan: 8,    // 时干
        hourZhi: 8     // 时支
    } : {
        yearGan: 12,
        yearZhi: 12,
        monthGan: 15,
        monthZhi: 45,  // 无时辰时，月令权重放大至45%
        dayZhi: 16
    };

    // 累加各个位置的五行得分
    if (bazi.yearGan) scores[STEM_ELEMENT[bazi.yearGan]] += weights.yearGan;
    if (bazi.yearZhi) scores[BRANCH_ELEMENT[bazi.yearZhi]] += weights.yearZhi;
    if (bazi.monthGan) scores[STEM_ELEMENT[bazi.monthGan]] += weights.monthGan;
    if (bazi.monthZhi) scores[BRANCH_ELEMENT[bazi.monthZhi]] += weights.monthZhi;
    if (bazi.dayZhi) scores[BRANCH_ELEMENT[bazi.dayZhi]] += weights.dayZhi;
    
    // 如果有八字时柱，累加时柱得分
    if (hasTime) {
        if (bazi.hourGan) scores[STEM_ELEMENT[bazi.hourGan]] += weights.hourGan;
        if (bazi.hourZhi) scores[BRANCH_ELEMENT[bazi.hourZhi]] += weights.hourZhi;
    }

    // 计算“同类”能量（日主本命五行 + 生我者的印星五行）
    const selfElement = dayMasterElement;
    const resourceElement = RESOURCE_MAP[dayMasterElement];
    const sameScore = scores[selfElement] + scores[resourceElement];
    
    // 计算“异类”能量（克我、我克、我生）
    const diffScore = 100 - sameScore;

    // 同类得分 >= 50 判为“身强”，否则判为“身弱”
    const isStrong = sameScore >= 50;

    // 推导喜用神五行
    let favorableElements = [];
    if (isStrong) {
        // 身强：喜“克、泄、耗”来平衡多余能量，喜用神为异类（食伤、财星、官杀）
        const outElement = GENERATING_MAP[selfElement]; // 食伤（我生）
        const wealthElement = GENERATING_MAP[outElement]; // 财星（我克）
        const powerElement = RESOURCE_MAP[resourceElement]; // 官杀（克我）
        favorableElements = [outElement, wealthElement, powerElement];
    } else {
        // 身弱：喜“生、扶”来补充自身能量，喜用神为同类（印星、比劫）
        favorableElements = [resourceElement, selfElement];
    }

    return {
        scores,
        sameScore,
        diffScore,
        isStrong,
        favorableElements,
        dayMasterElement
    };
}

/**
 * 获取日主 (Day Master) 及完整的八字四柱与喜忌分析
 * @param {string} birthDateStr 'YYYY-MM-DD'
 * @param {string} birthTimeStr 'HH:mm' (选填)
 * @returns {object} 包含八字干支和喜忌打分分析的对象
 */
export function getDayMaster(birthDateStr, birthTimeStr = '') {
    try {
        const date = new Date(birthDateStr);
        let solar;
        let isLateZi = false;
        let hour = 0;
        let minute = 0;

        if (birthTimeStr) {
            const parts = birthTimeStr.split(':').map(Number);
            hour = parts[0];
            minute = parts[1];
            // 传统八字：23:00 - 24:00 属于下一天的子时（称为夜子时/晚子时）
            // 此时日天干必须使用下一天的天干计算，时柱为当天的子时
            if (hour === 23) {
                isLateZi = true;
            }
        }

        // 如果是夜子时出生，日期向后推一天计算日柱
        if (isLateZi) {
            const nextDate = new Date(date.getTime() + 24 * 60 * 60 * 1000);
            solar = Solar.fromYmdHms(
                nextDate.getFullYear(),
                nextDate.getMonth() + 1,
                nextDate.getDate(),
                hour,
                minute,
                0
            );
        } else {
            if (birthTimeStr) {
                solar = Solar.fromYmdHms(date.getFullYear(), date.getMonth() + 1, date.getDate(), hour, minute, 0);
            } else {
                solar = Solar.fromYmd(date.getFullYear(), date.getMonth() + 1, date.getDate());
            }
        }

        const lunar = solar.getLunar();

        // 提取八字天干地支（四柱）
        const bazi = {
            yearGan: lunar.getYearGan(),
            yearZhi: lunar.getYearZhi(),
            monthGan: lunar.getMonthGan(),
            monthZhi: lunar.getMonthZhi(),
            dayGan: lunar.getDayGan(),
            dayZhi: lunar.getDayZhi(),
            hourGan: birthTimeStr ? lunar.getTimeGan() : null,
            hourZhi: birthTimeStr ? lunar.getTimeZhi() : null,
        };

        // 进行喜忌强弱打分分析
        const analysis = analyzeBaziStrength(bazi, !!birthTimeStr);

        return {
            dayGan: bazi.dayGan,
            hourGan: bazi.hourGan,
            timeProvided: !!birthTimeStr,
            isLateZi,
            bazi,
            analysis
        };
    } catch (e) {
        console.error("Error calculating Day Master:", e);
        return null;
    }
}

/**
 * 获取今日能量与佩戴建议（升级精准版）
 * @param {string} birthDateStr
 * @param {string} birthTimeStr (选填)
 */
export function getDailyRecommendation(birthDateStr, birthTimeStr = '') {
    if (!birthDateStr) return null;

    // 1. 计算用户命盘与喜忌
    const userProfile = getDayMaster(birthDateStr, birthTimeStr);

    if (!userProfile) {
        console.error("Failed to calculate User Profile");
        return null;
    }

    const { analysis, bazi } = userProfile;
    const userElement = analysis.dayMasterElement;
    const isStrong = analysis.isStrong;
    const favorableElements = analysis.favorableElements;

    // 2. 计算今日能量 (流日干支与流日五行)
    const today = new Date();
    const todaySolar = Solar.fromYmd(today.getFullYear(), today.getMonth() + 1, today.getDate());
    const todayLunar = todaySolar.getLunar();
    const todayDayGan = todayLunar.getDayGan();
    const todayElement = WUXING_MAP[todayDayGan];

    // 3. 根据喜忌神关系决定推荐策略（比劫、印星、食伤、财星、官杀）
    let recommendElement = '';
    let reason = '';
    let relation = '';

    // 判断流日五行在日主命盘中对应的十神（Ten Gods）角色
    const getTenGodName = (element) => {
        if (element === userElement) return '比劫';
        if (element === RESOURCE_MAP[userElement]) return '印星';
        if (element === GENERATING_MAP[userElement]) return '食伤';
        if (element === GENERATING_MAP[GENERATING_MAP[userElement]]) return '财星';
        return '官杀';
    };

    const todayGod = getTenGodName(todayElement);
    const isTodayFavorable = favorableElements.includes(todayElement);

    if (isTodayFavorable) {
        // 今日流日为喜用神：顺势而为，佩戴同类五行放大好运
        recommendElement = todayElement;
        relation = '顺遂';

        if (todayElement === userElement) {
            reason = `今日流日逢【${todayGod}】同频，且为你的喜用能量。建议佩戴【${recommendElement}】系珠宝，内外共鸣，自信笃定，最大化彰显个人气场。`;
        } else if (todayElement === RESOURCE_MAP[userElement]) {
            reason = `今日流日逢【${todayGod}】滋养，为你补充源源不断的喜用能量。适合佩戴【${recommendElement}】系珠宝，静心聚能，接纳灵感与祥和。`;
        } else if (todayElement === GENERATING_MAP[userElement]) {
            reason = `今日流日逢【${todayGod}】泄秀，才华与创意灵动。适合佩戴【${recommendElement}】系珠宝，激发行动力，让内心想法绽放光芒。`;
        } else if (todayElement === GENERATING_MAP[GENERATING_MAP[userElement]]) {
            reason = `今日流日逢【${todayGod}】财星，机遇显现，掌控力极佳。推荐佩戴【${recommendElement}】系珠宝，稳固磁场，从容握住财源与转机。`;
        } else {
            reason = `今日流日逢【${todayGod}】官杀，规则与秩序井然。适宜佩戴【${recommendElement}】系珠宝，淬炼心性，展现干练果敢的决断力与魄力。`;
        }
    } else {
        // 今日流日为忌神：能量有偏，采用通关/克制策略进行平衡化解
        relation = '化解';

        if (todayGod === '官杀') {
            // 官杀克身 -> 用印星（生我）化解，达到“官印相生”
            recommendElement = RESOURCE_MAP[userElement];
            reason = `今日流日逢【${todayGod}】压制，外界阻力较重。建议佩戴【${recommendElement}】系珠宝以印化煞，平复焦虑，将外部压力转化为自我成长的智慧。`;
        } else if (todayGod === '食伤') {
            // 食伤泄身 -> 用印星（克制食伤且补身）来收敛
            recommendElement = RESOURCE_MAP[userElement];
            reason = `今日流日逢【${todayGod}】过度泄耗，易感疲惫或思虑伤神。适合佩戴【${recommendElement}】系珠宝补充印星元气，收拢精力，归于平静。`;
        } else if (todayGod === '财星') {
            // 财星耗身 -> 用本命五行/比劫（同我帮身）来担当财富
            recommendElement = userElement;
            reason = `今日流日逢【${todayGod}】消耗，需要充沛的精力去承载财富。推荐佩戴本命【${recommendElement}】系珠宝强根固本，强健磁场，稳稳接纳运势。`;
        } else if (todayGod === '比劫') {
            // 比劫过旺（身强忌比劫） -> 用食伤（我生）宣泄多余精力
            recommendElement = GENERATING_MAP[userElement];
            reason = `今日流日逢【${todayGod}】重叠，能量过载易生急躁。建议佩戴【${recommendElement}】系珠宝疏导，将过盛的精力转化为温和的才华和表达。`;
        } else {
            // 印星过盛（身强忌印星，停滞） -> 用财星（我克，财能克印破局）
            recommendElement = GENERATING_MAP[GENERATING_MAP[userElement]];
            reason = `今日流日逢【${todayGod}】重重包围，易流于空想、行动迟缓。适合佩戴【${recommendElement}】系珠宝，以财破印，脚踏实地做具体的事，打破停滞。`;
        }
    }

    const jewelryInfo = JEWELRY_DB[recommendElement];

    return {
        user: {
            dayGan: userProfile.dayGan,
            element: userElement,
            hourGan: userProfile.hourGan,
            baziText: `${bazi.yearGan}${bazi.yearZhi} ${bazi.monthGan}${bazi.monthZhi} ${bazi.dayGan}${bazi.dayZhi}${bazi.hourGan ? ' ' + bazi.hourGan + bazi.hourZhi : ''}`,
            analysis: {
                isStrong,
                scores: analysis.scores,
                favorableText: favorableElements.join('、')
            }
        },
        today: {
            date: todayLunar.toString(),
            ganZhi: `${todayLunar.getYearInGanZhi()}年 ${todayLunar.getMonthInGanZhi()}月 ${todayLunar.getDayInGanZhi()}日`,
            element: todayElement,
            god: todayGod
        },
        recommendation: {
            ...jewelryInfo,
            reason,
            relation
        }
    };
}
