// Function to set a cookie
function setCookie(name, value, days, path = '/') {
    let expires = "";
    if (days) {
        let date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=" + path;
    console.log(`Cookie set: ${name} = ${value}; expires in ${days} days; path = ${path}`);
}

// Function to get a cookie
function getCookie(name) {
    let nameEQ = name + "=";
    let ca = document.cookie.split(';');
    for(let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}

// Function to save input values to cookies
function saveValuesToCookies() {
    const inputs = ['Fvo', 'Fda', 'Fvi', 'base_vo', 'base_da', 'base_vi', 'bonus_vo', 'bonus_da', 'bonus_vi'];
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            setCookie(inputId, element.value, 365);
            element.addEventListener('input', () => {
                setCookie(inputId, element.value, 365);
                console.log(`Cookie updated: ${inputId} = ${element.value}`);
            });
        }
    });
}

// Function to load input values from cookies
function loadValuesFromCookies() {
    const inputs = ['Fvo', 'Fda', 'Fvi', 'base_vo', 'base_da', 'base_vi', 'bonus_vo', 'bonus_da', 'bonus_vi'];
    inputs.forEach(inputId => {
        const element = document.getElementById(inputId);
        if (element) {
            const cookieValue = getCookie(inputId);
            if (cookieValue) {
                element.value = cookieValue;
                console.log(`Loaded value for ${inputId}: ${cookieValue}`);
                const event = new Event('input');
                element.dispatchEvent(event);
            }
        }
    });
}

function calculate() {
    const maxIdolParameter = 1500;
    const finalExamScoreRates = [
        { upperBound: 5000, rate: 30 },
        { upperBound: 10000, rate: 15 },
        { upperBound: 20000, rate: 8 },
        { upperBound: 30000, rate: 4 },
        { upperBound: 40000, rate: 2 },
        { upperBound: 100000000, rate: 1 },
    ];

    const calculateNecessaryFinalExamScoreForSpecificRating = (rating) => {
        let restRating = rating;
        for (const [index, finalExamScoreRate] of finalExamScoreRates.entries()) {
            const beforeUpperBound = index === 0 ? 0 : finalExamScoreRates[index - 1].upperBound;
            const maxRatingInThisRange = ((finalExamScoreRate.upperBound - beforeUpperBound) * finalExamScoreRate.rate) / 100;
            if (restRating > maxRatingInThisRange) {
                restRating -= maxRatingInThisRange;
            } else {
                return Math.ceil((restRating / finalExamScoreRate.rate) * 100) + beforeUpperBound;
            }
        }
        throw new Error("`rating` is out of range.");
    };

    // Get input values for final stat calculation
    let vo = parseInt(document.getElementById('Fvo').value) || 0;
    let da = parseInt(document.getElementById('Fda').value) || 0;
    let vi = parseInt(document.getElementById('Fvi').value) || 0;

    // Calculate totals for final stat
    let total = Math.min(vo, maxIdolParameter) + Math.min(da, maxIdolParameter) + Math.min(vi, maxIdolParameter);
    let total_bonus = Math.min(vo + 30, maxIdolParameter) + Math.min(da + 30, maxIdolParameter) + Math.min(vi + 30, maxIdolParameter);

    // Display results for final stat
    document.getElementById('total').textContent = total;
    document.getElementById('total_bonus').textContent = total_bonus;

    // Calculate rank scores
    const fixedRating = 1700 + Math.floor((total_bonus * 23) / 10);
    const ranks = [
        { name: "splus", necessaryRating: 14500 },
        { name: "s", necessaryRating: 13000 },
        { name: "aplus", necessaryRating: 11500 },
        { name: "a", necessaryRating: 10000 },
    ];

    ranks.forEach(rank => {
        const necessaryScore = calculateNecessaryFinalExamScoreForSpecificRating(Math.max(rank.necessaryRating - fixedRating, 0));
        let displayText = necessaryScore < 10000 ? "pass" : Math.floor(necessaryScore).toLocaleString();
        document.getElementById(`rank_${rank.name}`).textContent = displayText;
    });

    console.log("Calculation completed"); // For debugging
}

// Attach event listeners to input fields for final stat
document.getElementById('Fvo').addEventListener('input', calculate);
document.getElementById('Fda').addEventListener('input', calculate);
document.getElementById('Fvi').addEventListener('input', calculate);

// Initial calculation for final stat
calculate();

// Lesson table bonus sync
document.addEventListener('DOMContentLoaded', function () {
    const bonusVo = document.getElementById('bonus_vo');
    const bonusDa = document.getElementById('bonus_da');
    const bonusVi = document.getElementById('bonus_vi');

    const lessonBonusVo = document.getElementById('lesson_bonus_vo');
    const lessonBonusDa = document.getElementById('lesson_bonus_da');
    const lessonBonusVi = document.getElementById('lesson_bonus_vi');

    function updateLessonBonus() {
        lessonBonusVo.textContent = bonusVo.value;
        lessonBonusDa.textContent = bonusDa.value;
        lessonBonusVi.textContent = bonusVi.value;
    }

    bonusVo.addEventListener('input', updateLessonBonus);
    bonusDa.addEventListener('input', updateLessonBonus);
    bonusVi.addEventListener('input', updateLessonBonus);
});

// Lesson table calculate
document.addEventListener('DOMContentLoaded', function () {
    const bonusVo = document.getElementById('bonus_vo');
    const bonusDa = document.getElementById('bonus_da');
    const bonusVi = document.getElementById('bonus_vi');

    const lessonBonusVo = document.getElementById('lesson_bonus_vo');
    const lessonBonusDa = document.getElementById('lesson_bonus_da');
    const lessonBonusVi = document.getElementById('lesson_bonus_vi');

    function updateLessonBonus() {
        lessonBonusVo.textContent = bonusVo.value;
        lessonBonusDa.textContent = bonusDa.value;
        lessonBonusVi.textContent = bonusVi.value;
    }

    bonusVo.addEventListener('input', updateLessonBonus);
    bonusDa.addEventListener('input', updateLessonBonus);
    bonusVi.addEventListener('input', updateLessonBonus);
});

// Lesson table calculate
document.addEventListener('DOMContentLoaded', function () {
    const score1 = document.getElementById('score_1');
    const score4 = document.getElementById('score_4');
    const score10 = document.getElementById('score_10');
    const score12 = document.getElementById('score_12');
    const score13 = document.getElementById('score_13');
    const spscore4 = document.getElementById('SP_score_4');
    const spscore10 = document.getElementById('SP_score_10');
    const spscore12 = document.getElementById('SP_score_12');
    const spscore13 = document.getElementById('SP_score_13');

    const lessonVo1 = document.getElementById('lesson_vo_1');
    const lessonDa1 = document.getElementById('lesson_da_1');
    const lessonVi1 = document.getElementById('lesson_vi_1');
    const lessonVo4 = document.getElementById('lesson_vo_4');
    const lessonDa4 = document.getElementById('lesson_da_4');
    const lessonVi4 = document.getElementById('lesson_vi_4');
    const lessonVo10 = document.getElementById('lesson_vo_10');
    const lessonDa10 = document.getElementById('lesson_da_10');
    const lessonVi10 = document.getElementById('lesson_vi_10');
    const lessonVo12 = document.getElementById('lesson_vo_12');
    const lessonDa12 = document.getElementById('lesson_da_12');
    const lessonVi12 = document.getElementById('lesson_vi_12');
    const lessonVo13 = document.getElementById('lesson_vo_13');
    const lessonDa13 = document.getElementById('lesson_da_13');
    const lessonVi13 = document.getElementById('lesson_vi_13');

    const splessonVo4 = document.getElementById('SP_lesson_vo_4');
    const splessonDa4 = document.getElementById('SP_lesson_da_4');
    const splessonVi4 = document.getElementById('SP_lesson_vi_4');
    const splessonVo10 = document.getElementById('SP_lesson_vo_10');
    const splessonDa10 = document.getElementById('SP_lesson_da_10');
    const splessonVi10 = document.getElementById('SP_lesson_vi_10');
    const splessonVo12 = document.getElementById('SP_lesson_vo_12');
    const splessonDa12 = document.getElementById('SP_lesson_da_12');
    const splessonVi12 = document.getElementById('SP_lesson_vi_12');
    const splessonVo13 = document.getElementById('SP_lesson_vo_13');
    const splessonDa13 = document.getElementById('SP_lesson_da_13');
    const splessonVi13 = document.getElementById('SP_lesson_vi_13');

    const VomidlessonVO = document.getElementById('vo_mid_lesson_vo');
    const VomidlessonDA = document.getElementById('vo_mid_lesson_da');
    const VomidlessonVI = document.getElementById('vo_mid_lesson_vi');
    const DamidlessonVO = document.getElementById('da_mid_lesson_vo');
    const DamidlessonDA = document.getElementById('da_mid_lesson_da');
    const DamidlessonVI = document.getElementById('da_mid_lesson_vi');
    const VimidlessonVO = document.getElementById('vi_mid_lesson_vo');
    const VimidlessonDA = document.getElementById('vi_mid_lesson_da');
    const VimidlessonVI = document.getElementById('vi_mid_lesson_vi');

    const VofinallessonVO = document.getElementById('vo_final_lesson_vo');
    const VofinallessonDA = document.getElementById('vo_final_lesson_da');
    const VofinallessonVI = document.getElementById('vo_final_lesson_vi');
    const DafinallessonVO = document.getElementById('da_final_lesson_vo');
    const DafinallessonDA = document.getElementById('da_final_lesson_da');
    const DafinallessonVI = document.getElementById('da_final_lesson_vi');
    const VifinallessonVO = document.getElementById('vi_final_lesson_vo');
    const VifinallessonDA = document.getElementById('vi_final_lesson_da');
    const VifinallessonVI = document.getElementById('vi_final_lesson_vi');

    const bonusVo = document.getElementById('bonus_vo');
    const bonusDa = document.getElementById('bonus_da');
    const bonusVi = document.getElementById('bonus_vi');

    const schedule1Select = document.getElementById('schedule1');
    const schedule4Select = document.getElementById('schedule4');
    const schedule6Select = document.getElementById('schedule6');
    const schedule7Select = document.getElementById('schedule7');
    const schedule10Select = document.getElementById('schedule10');
    const schedule12Select = document.getElementById('schedule12');
    const schedule13Select = document.getElementById('schedule13');
    const schedule15Select = document.getElementById('schedule15');

    function updateLessonStats() {
        const score1Value = parseInt(score1.innerText, 10);
        const score4Value = parseInt(score4.innerText, 10);
        const score10Value = parseInt(score10.innerText, 10);
        const score12Value = parseInt(score12.innerText, 10);
        const score13Value = parseInt(score13.innerText, 10);

        const spscore4Value = parseInt(spscore4.innerText, 10);
        const spscore10Value = parseInt(spscore10.innerText, 10);
        const spscore12Value = parseInt(spscore12.innerText, 10);
        const spscore13Value = parseInt(spscore13.innerText, 10);

        const bonusVoValue = parseFloat(bonusVo.value) / 100;
        const bonusDaValue = parseFloat(bonusDa.value) / 100;
        const bonusViValue = parseFloat(bonusVi.value) / 100;

        lessonVo1.innerText = Math.floor(score1Value * bonusVoValue + score1Value);
        lessonDa1.innerText = Math.floor(score1Value * bonusDaValue + score1Value);
        lessonVi1.innerText = Math.floor(score1Value * bonusViValue + score1Value);

        lessonVo4.innerText = Math.floor(score4Value * bonusVoValue + score4Value);
        lessonDa4.innerText = Math.floor(score4Value * bonusDaValue + score4Value);
        lessonVi4.innerText = Math.floor(score4Value * bonusViValue + score4Value);

        lessonVo10.innerText = Math.floor(score10Value * bonusVoValue + score10Value);
        lessonDa10.innerText = Math.floor(score10Value * bonusDaValue + score10Value);
        lessonVi10.innerText = Math.floor(score10Value * bonusViValue + score10Value);

        lessonVo12.innerText = Math.floor(score12Value * bonusVoValue + score12Value);
        lessonDa12.innerText = Math.floor(score12Value * bonusDaValue + score12Value);
        lessonVi12.innerText = Math.floor(score12Value * bonusViValue + score12Value);

        lessonVo13.innerText = Math.floor(score13Value * bonusVoValue + score13Value);
        lessonDa13.innerText = Math.floor(score13Value * bonusDaValue + score13Value);
        lessonVi13.innerText = Math.floor(score13Value * bonusViValue + score13Value);

        splessonVo4.innerText = Math.floor(spscore4Value * bonusVoValue + spscore4Value);
        splessonDa4.innerText = Math.floor(spscore4Value * bonusDaValue + spscore4Value);
        splessonVi4.innerText = Math.floor(spscore4Value * bonusViValue + spscore4Value);

        splessonVo10.innerText = Math.floor(spscore10Value * bonusVoValue + spscore10Value);
        splessonDa10.innerText = Math.floor(spscore10Value * bonusDaValue + spscore10Value);
        splessonVi10.innerText = Math.floor(spscore10Value * bonusViValue + spscore10Value);

        splessonVo12.innerText = Math.floor(spscore12Value * bonusVoValue + spscore12Value);
        splessonDa12.innerText = Math.floor(spscore12Value * bonusDaValue + spscore12Value);
        splessonVi12.innerText = Math.floor(spscore12Value * bonusViValue + spscore12Value);

        splessonVo13.innerText = Math.floor(spscore13Value * bonusVoValue + spscore13Value);
        splessonDa13.innerText = Math.floor(spscore13Value * bonusDaValue + spscore13Value);
        splessonVi13.innerText = Math.floor(spscore13Value * bonusViValue + spscore13Value);

        VomidlessonVO.innerText = Math.floor(180 * bonusVoValue + 180);
        VomidlessonDA.innerText = Math.floor(90 * bonusDaValue + 90);
        VomidlessonVI.innerText = Math.floor(90 * bonusViValue + 90);

        DamidlessonVO.innerText = Math.floor(90 * bonusVoValue + 90);
        DamidlessonDA.innerText = Math.floor(180 * bonusDaValue + 180);
        DamidlessonVI.innerText = Math.floor(90 * bonusViValue + 90);


        VimidlessonVO.innerText = Math.floor(90 * bonusVoValue + 90);
        VimidlessonDA.innerText = Math.floor(90 * bonusDaValue + 90);
        VimidlessonVI.innerText = Math.floor(180 * bonusViValue + 180);

        VofinallessonVO.innerText = Math.floor(310 * bonusVoValue + 310);
        VofinallessonDA.innerText = Math.floor(145 * bonusDaValue + 145);
        VofinallessonVI.innerText = Math.floor(145 * bonusViValue + 145);

        DafinallessonVO.innerText = Math.floor(145 * bonusVoValue + 145);
        DafinallessonDA.innerText = Math.floor(310 * bonusDaValue + 310);
        DafinallessonVI.innerText = Math.floor(145 * bonusViValue + 145);

        VifinallessonVO.innerText = Math.floor(145 * bonusVoValue + 145);
        VifinallessonDA.innerText = Math.floor(145* bonusDaValue + 145);
        VifinallessonVI.innerText = Math.floor(310 * bonusViValue + 310);
    
        // Update schedules after lesson stats are updated
        updateSchedule1();
        updateSchedule4();
        updateSchedule6();
        updateSchedule7();
        updateSchedule10();
        updateSchedule12();
        updateSchedule13();
        updateSchedule15();
    }

    bonusVo.addEventListener('input', updateLessonStats);
    bonusDa.addEventListener('input', updateLessonStats);
    bonusVi.addEventListener('input', updateLessonStats);

    schedule1Select.addEventListener('change', updateSchedule1);
    schedule4Select.addEventListener('change', updateSchedule4);
    schedule6Select.addEventListener('change', updateSchedule6);
    schedule7Select.addEventListener('change', updateSchedule7);
    schedule10Select.addEventListener('change', updateSchedule10);
    schedule12Select.addEventListener('change', updateSchedule12);
    schedule13Select.addEventListener('change', updateSchedule13);
    schedule15Select.addEventListener('change', updateSchedule15);

    function updateSchedule1() {
        const selectedOption = schedule1Select.value;
        if (selectedOption === 'Vo') {
            document.getElementById('vo1').innerText = lessonVo1.innerText;
            document.getElementById('da1').innerText = 0;
            document.getElementById('vi1').innerText = 0;
        } else if (selectedOption === 'Da') {
            document.getElementById('vo1').innerText = 0;
            document.getElementById('da1').innerText = lessonDa1.innerText;
            document.getElementById('vi1').innerText = 0;
        } else if (selectedOption === 'Vi') {
            document.getElementById('vo1').innerText = 0;
            document.getElementById('da1').innerText = 0;
            document.getElementById('vi1').innerText = lessonVi1.innerText;
        } else {
            document.getElementById('vo1').innerText = 0;
            document.getElementById('da1').innerText = 0;
            document.getElementById('vi1').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule4() {
        const selectedOption = schedule4Select.value;
        if (selectedOption === 'Vo') {
            document.getElementById('vo4').innerText = lessonVo4.innerText;
            document.getElementById('da4').innerText = 0;
            document.getElementById('vi4').innerText = 0;
        } else if (selectedOption === 'Da') {
            document.getElementById('vo4').innerText = 0;
            document.getElementById('da4').innerText = lessonDa4.innerText;
            document.getElementById('vi4').innerText = 0;
        } else if (selectedOption === 'Vi') {
            document.getElementById('vo4').innerText = 0;
            document.getElementById('da4').innerText = 0;
            document.getElementById('vi4').innerText = lessonVi4.innerText;
        } else if (selectedOption === 'Sp Vo') {
            document.getElementById('vo4').innerText = splessonVo4.innerText;
            document.getElementById('da4').innerText = 0;
            document.getElementById('vi4').innerText = 0;
        } else if (selectedOption === 'Sp Da') {
            document.getElementById('vo4').innerText = 0;
            document.getElementById('da4').innerText = splessonDa4.innerText;
            document.getElementById('vi4').innerText = 0;
        } else if (selectedOption === 'Sp Vi') {
            document.getElementById('vo4').innerText = 0;
            document.getElementById('da4').innerText = 0;
            document.getElementById('vi4').innerText = splessonVi4.innerText;
        }else {
            document.getElementById('vo4').innerText = 0;
            document.getElementById('da4').innerText = 0;
            document.getElementById('vi4').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule6() {
        const selectedOption = schedule6Select.value;
        if (selectedOption === 'Mid Vo') {
            document.getElementById('vo6').innerText = VomidlessonVO.innerText;
            document.getElementById('da6').innerText = VomidlessonDA.innerText;
            document.getElementById('vi6').innerText = VomidlessonVI.innerText;
        } else if (selectedOption === 'Mid Da') {
            document.getElementById('vo6').innerText = DamidlessonVO.innerText;
            document.getElementById('da6').innerText = DamidlessonDA.innerText;
            document.getElementById('vi6').innerText = DamidlessonVI.innerText;
        } else if (selectedOption === 'Mid Vi') {
            document.getElementById('vo6').innerText = VimidlessonVO.innerText;
            document.getElementById('da6').innerText = VimidlessonDA.innerText;
            document.getElementById('vi6').innerText = VimidlessonVI.innerText;
        } else {
            document.getElementById('vo6').innerText = 0;
            document.getElementById('da6').innerText = 0;
            document.getElementById('vi6').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule7() {
        const selectedOption = schedule7Select.value;
        if (selectedOption === 'mid test bonus') {
            document.getElementById('vo7').innerText = 20;
            document.getElementById('da7').innerText = 20;
            document.getElementById('vi7').innerText = 20;
        } else {
            document.getElementById('vo7').innerText = 0;
            document.getElementById('da7').innerText = 0;
            document.getElementById('vi7').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule10() {
        const selectedOption = schedule10Select.value;
        if (selectedOption === 'Vo') {
            document.getElementById('vo10').innerText = lessonVo10.innerText;
            document.getElementById('da10').innerText = 0;
            document.getElementById('vi10').innerText = 0;
        } else if (selectedOption === 'Da') {
            document.getElementById('vo10').innerText = 0;
            document.getElementById('da10').innerText = lessonDa10.innerText;
            document.getElementById('vi10').innerText = 0;
        } else if (selectedOption === 'Vi') {
            document.getElementById('vo10').innerText = 0;
            document.getElementById('da10').innerText = 0;
            document.getElementById('vi10').innerText = lessonVi10.innerText;
        } else if (selectedOption === 'Sp Vo') {
            document.getElementById('vo10').innerText = splessonVo10.innerText;
            document.getElementById('da10').innerText = 0;
            document.getElementById('vi10').innerText = 0;
        } else if (selectedOption === 'Sp Da') {
            document.getElementById('vo10').innerText = 0;
            document.getElementById('da10').innerText = splessonDa10.innerText;
            document.getElementById('vi10').innerText = 0;
        } else if (selectedOption === 'Sp Vi') {
            document.getElementById('vo10').innerText = 0;
            document.getElementById('da10').innerText = 0;
            document.getElementById('vi10').innerText = splessonVi10.innerText;
        }else {
            document.getElementById('vo10').innerText = 0;
            document.getElementById('da10').innerText = 0;
            document.getElementById('vi10').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule12() {
        const selectedOption = schedule12Select.value;
        if (selectedOption === 'Vo') {
            document.getElementById('vo12').innerText = lessonVo12.innerText;
            document.getElementById('da12').innerText = 0;
            document.getElementById('vi12').innerText = 0;
        } else if (selectedOption === 'Da') {
            document.getElementById('vo12').innerText = 0;
            document.getElementById('da12').innerText = lessonDa12.innerText;
            document.getElementById('vi12').innerText = 0;
        } else if (selectedOption === 'Vi') {
            document.getElementById('vo12').innerText = 0;
            document.getElementById('da12').innerText = 0;
            document.getElementById('vi12').innerText = lessonVi12.innerText;
        } else if (selectedOption === 'Sp Vo') {
            document.getElementById('vo12').innerText = splessonVo12.innerText;
            document.getElementById('da12').innerText = 0;
            document.getElementById('vi12').innerText = 0;
        } else if (selectedOption === 'Sp Da') {
            document.getElementById('vo12').innerText = 0;
            document.getElementById('da12').innerText = splessonDa12.innerText;
            document.getElementById('vi12').innerText = 0;
        } else if (selectedOption === 'Sp Vi') {
            document.getElementById('vo12').innerText = 0;
            document.getElementById('da12').innerText = 0;
            document.getElementById('vi12').innerText = splessonVi12.innerText;
        } else {
            document.getElementById('vo12').innerText = 0;
            document.getElementById('da12').innerText = 0;
            document.getElementById('vi12').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule13() {
        const selectedOption = schedule13Select.value;
        if (selectedOption === 'Vo') {
            document.getElementById('vo13').innerText = lessonVo13.innerText;
            document.getElementById('da13').innerText = 0;
            document.getElementById('vi13').innerText = 0;
        } else if (selectedOption === 'Da') {
            document.getElementById('vo13').innerText = 0;
            document.getElementById('da13').innerText = lessonDa13.innerText;
            document.getElementById('vi13').innerText = 0;
        } else if (selectedOption === 'Vi') {
            document.getElementById('vo13').innerText = 0;
            document.getElementById('da13').innerText = 0;
            document.getElementById('vi13').innerText = lessonVi13.innerText;
        } else if (selectedOption === 'Sp Vo') {
            document.getElementById('vo13').innerText = splessonVo13.innerText;
            document.getElementById('da13').innerText = 0;
            document.getElementById('vi13').innerText = 0;
        } else if (selectedOption === 'Sp Da') {
            document.getElementById('vo13').innerText = 0;
            document.getElementById('da13').innerText = splessonDa13.innerText;
            document.getElementById('vi13').innerText = 0;
        } else if (selectedOption === 'Sp Vi') {
            document.getElementById('vo13').innerText = 0;
            document.getElementById('da13').innerText = 0;
            document.getElementById('vi13').innerText = splessonVi13.innerText;
        }else {
            document.getElementById('vo13').innerText = 0;
            document.getElementById('da13').innerText = 0;
            document.getElementById('vi13').innerText = 0;
        }
        calculateTotals();
    }

    function updateSchedule15() {
        const selectedOption = schedule15Select.value;
        if (selectedOption === 'Final Vo') {
            document.getElementById('vo15').innerText = VofinallessonVO.innerText;
            document.getElementById('da15').innerText = VofinallessonDA.innerText;
            document.getElementById('vi15').innerText = VofinallessonVI.innerText;
        } else if (selectedOption === 'Final Da') {
            document.getElementById('vo15').innerText = DafinallessonVO.innerText;
            document.getElementById('da15').innerText = DafinallessonDA.innerText;
            document.getElementById('vi15').innerText = DafinallessonVI.innerText;
        } else if (selectedOption === 'Final Vi') {
            document.getElementById('vo15').innerText = VifinallessonVO.innerText;
            document.getElementById('da15').innerText = VifinallessonDA.innerText;
            document.getElementById('vi15').innerText = VifinallessonVI.innerText;
        }else {
            document.getElementById('vo15').innerText = 0;
            document.getElementById('da15').innerText = 0;
            document.getElementById('vi15').innerText = 0;
        }
        calculateTotals();

    }
    schedule1Select.addEventListener('change', updateSchedule1);
    schedule4Select.addEventListener('change', updateSchedule4);
    schedule6Select.addEventListener('change', updateSchedule6);
    schedule7Select.addEventListener('change', updateSchedule7);
    schedule10Select.addEventListener('change', updateSchedule10);
    schedule12Select.addEventListener('change', updateSchedule12);
    schedule13Select.addEventListener('change', updateSchedule13);
    schedule15Select.addEventListener('change', updateSchedule15);
    bonusVo.addEventListener('input', updateLessonStats);
    bonusDa.addEventListener('input', updateLessonStats);
    bonusVi.addEventListener('input', updateLessonStats);
    updateLessonStats();
});

//lesson total calculate
function calculateTotals() {
    const baseVo = parseInt(document.getElementById('base_vo').value) || 0;
    const baseDa = parseInt(document.getElementById('base_da').value) || 0;
    const baseVi = parseInt(document.getElementById('base_vi').value) || 0;

    let totalVo = baseVo;
    let totalDa = baseDa;
    let totalVi = baseVi;

    for (let i = 1; i <= 16; i++) {
        totalVo += parseInt(document.getElementById(`vo${i}`).innerText) || 0;
        totalDa += parseInt(document.getElementById(`da${i}`).innerText) || 0;
        totalVi += parseInt(document.getElementById(`vi${i}`).innerText) || 0;
    }

    document.getElementById('total_max_1500_vo').innerText = Math.min(totalVo, 1500);
    document.getElementById('total_max_1500_da').innerText = Math.min(totalDa, 1500);
    document.getElementById('total_max_1500_vi').innerText = Math.min(totalVi, 1500);

    // Calculate and display over 1500 values with new logic
    document.getElementById('over_1500_vo').innerText = totalVo <= 1500 ? "not exceed" : (totalVo - 1500);
    document.getElementById('over_1500_da').innerText = totalDa <= 1500 ? "not exceed" : (totalDa - 1500);
    document.getElementById('over_1500_vi').innerText = totalVi <= 1500 ? "not exceed" : (totalVi - 1500);

    // Calculate and display total of all stats
    const totalAll = Math.min(totalVo, 1500) + Math.min(totalDa, 1500) + Math.min(totalVi, 1500);
    document.getElementById('total_all').innerText = totalAll;
}

// Add event listeners to base stat inputs and all relevant td elements
document.getElementById('base_vo').addEventListener('input', calculateTotals);
document.getElementById('base_da').addEventListener('input', calculateTotals);
document.getElementById('base_vi').addEventListener('input', calculateTotals);

for (let i = 1; i <= 16; i++) {
    document.getElementById(`vo${i}`).addEventListener('DOMSubtreeModified', calculateTotals);
    document.getElementById(`da${i}`).addEventListener('DOMSubtreeModified', calculateTotals);
    document.getElementById(`vi${i}`).addEventListener('DOMSubtreeModified', calculateTotals);
}

// Initial calculation
calculateTotals();



document.addEventListener('DOMContentLoaded', function() {
    // Modal control functions
    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "block";
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.style.display = "none";
        }
    }

    // Reset inputs function
    function resetInputs() {
        const inputs = document.querySelectorAll('.table input');
        inputs.forEach(input => {
            input.value = '0';
        });

        console.log('Table reset to 0 complete');
        calculate();  // Assuming this function exists elsewhere in your code
    }

    // Add event listeners for buttons
    const usageButton = document.getElementById('usageButton');
    const resetButton = document.getElementById('resetButton');
    const lessonButton = document.getElementById('lessonButton');

    if (usageButton) {
        usageButton.addEventListener('click', function() {
            showModal('usageModal');
        });
    }

    if (resetButton) {
        resetButton.addEventListener('click', resetInputs);
    }

    if (lessonButton) {
        lessonButton.addEventListener('click', function() {
            showModal('lessonModal');
        });
    }

    // Modal close buttons
    const closeButtons = document.querySelectorAll('.close');
    closeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const modal = this.closest('.modal');
            if (modal) {
                closeModal(modal.id);
            }
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target.classList.contains('modal')) {
            closeModal(event.target.id);
        }
    });

    // Persist active tab across page reloads
    var tabEl = document.querySelectorAll('a[data-bs-toggle="tab"]');
    tabEl.forEach(function(tab) {
        tab.addEventListener('shown.bs.tab', function(event) {
            var activeTab = event.target;
            localStorage.setItem('activeTab', activeTab.id);
        });
    });

    var lastActiveTab = localStorage.getItem('activeTab');
    if (lastActiveTab) {
        var tab = new bootstrap.Tab(document.getElementById(lastActiveTab));
        tab.show();
    }

    // Load values from cookies after page loads
    loadValuesFromCookies();
    saveValuesToCookies();
});
