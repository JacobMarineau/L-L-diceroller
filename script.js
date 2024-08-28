function legendsDamageCal(damage, damageType, AR, MR, HP, THP, OS) {
  let remainingDamage = damage;
  let immunityGranted = false;

  // Apply damage to Over-Shields (OS)
  if (OS > 0) {
    if (remainingDamage <= OS) {
      OS -= remainingDamage;
      remainingDamage = 0;
    } else {
      remainingDamage -= OS;
      OS = 0;
      immunityGranted = true; // Grant immunity only if OS was depleted during this attack
    }
  }

  // Apply damage reduction based on type (Physical or Magic)
  if (!immunityGranted) {
    if (damageType === "physical") {
      remainingDamage -= AR;
    } else if (damageType === "magic") {
      remainingDamage /= 2; // Apply Magic Resistance by halving the damage
    }

    // Ensure no negative damage after reduction
    remainingDamage = Math.max(remainingDamage, 0);

    // Apply damage to Temporary Health Points (THP)
    if (THP > 0) {
      if (remainingDamage <= THP) {
        THP -= remainingDamage;
        remainingDamage = 0;
      } else {
        remainingDamage -= THP;
        THP = 0;
      }
    }

    // Apply damage to Health Points (HP)
    if (HP > 0) {
      if (remainingDamage <= HP) {
        HP -= remainingDamage;
        remainingDamage = 0;
      } else {
        remainingDamage -= HP;
        HP = 0;
      }
    }
  }

  // Return the updated values for HP, THP, OS
  return {
    remainingHP: HP,
    remainingTHP: THP,
    remainingOS: OS,
    immunityGranted: immunityGranted, // Indicates if immunity was applied this turn
  };
}

function damageCal() {
  const damage = parseInt(document.getElementById("damage").value);
  const damageType = document.getElementById("damageType").value;
  const AR = parseInt(document.getElementById("AR").value);
  const MR = parseFloat(document.getElementById("MR").value);
  let HP = parseInt(document.getElementById("HP").value);
  let THP = parseInt(document.getElementById("THP").value);
  let OS = parseInt(document.getElementById("OS").value);

  const result = legendsDamageCal(damage, damageType, AR, MR, HP, THP, OS);

  // Display results
  document.getElementById("results").innerHTML = `
        <p>Remaining Health Points (HP): ${Math.round(result.remainingHP)}</p>
        <p>Remaining Temporary Health Points (THP): ${result.remainingTHP}</p>
        <p>Remaining Over-Shields (OS): ${result.remainingOS}</p>
        <p>Immunity Granted: ${result.immunityGranted ? "Yes" : "No"}</p>
    `;

  // Update the form with the new values for next attack
  document.getElementById("HP").value = Math.round(result.remainingHP);
  document.getElementById("THP").value = result.remainingTHP;
  document.getElementById("OS").value = result.remainingOS;
}
