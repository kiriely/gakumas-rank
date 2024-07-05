function calculate() {
    // Get input values for final stat calculation
    let vo = parseInt(document.getElementById('vo').value) || 0;
    let da = parseInt(document.getElementById('da').value) || 0;
    let vi = parseInt(document.getElementById('vi').value) || 0;

    // Calculate totals for final stat
    let total = 
        (vo > 1500 ? 1500 : vo) + 
        (da > 1500 ? 1500 : da) + 
        (vi > 1500 ? 1500 : vi);
    let total_bonus = 
        (vo + 30 > 1500 ? 1500 : vo + 30) + 
        (da + 30 > 1500 ? 1500 : da + 30) + 
        (vi + 30 > 1500 ? 1500 : vi + 30);

    // Display results for final stat
    document.getElementById('total').textContent = total;
    document.getElementById('total_bonus').textContent = total_bonus;

    // Calculate rank scores
    let L6 = total_bonus;

    let rank_s = (L6 * 2.3 + 1700 + 3450 > 13000) 
        ? Math.floor((13000 - ((L6 * 2.3) + 1700 + 3050)) / 0.04) + 20000 
        : Math.floor((13000 - ((L6 * 2.3) + 1700 + 3450)) / 0.02) + 30000;

    let rank_aplus = (L6 * 2.3 + 1700 + 2250 > 11500) 
        ? "ผ่าน" 
        : Math.floor((11500 - ((L6 * 2.3) + 1700 + ((5000 * 0.3) + (5000 * 0.15)))) / 0.08) + 10000;

    let rank_a = (L6 * 2.3 + 1700 + (50000 * 0.3 + 5000 * 0.15) > 10000) 
        ? "ผ่าน" 
        : Math.floor((10000 - (L6 * 2.3 + 1700 + (50000 * 0.3 + 50000 * 0.15))) / 0.08) + 10000;

    document.getElementById('rank_s').textContent = rank_s;
    document.getElementById('rank_aplus').textContent = rank_aplus;
    document.getElementById('rank_a').textContent = rank_a;
}

// Attach event listeners to input fields for final stat
document.getElementById('vo').addEventListener('input', calculate);
document.getElementById('da').addEventListener('input', calculate);
document.getElementById('vi').addEventListener('input', calculate);

// Initial calculation for final stat
calculate();
