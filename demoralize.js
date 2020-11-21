const action = {
    name: "Demoralize",
    skill: "Intimidation",
    targetDC: "Will",
    degreesOfSuccess: {
        criticalSuccess: "The target becomes frightened 2.",
        success: "The target becomes frightened 1.",
    },
};
(async () => {
    const skillKey = Object.keys(actor.data.data.skills).find(
        (key) => actor.data.data.skills[key].name === action.skill.toLowerCase()
    );
    const options = actor.getRollOptions([
        "all",
        "skill-check",
        action.skill.toLowerCase(),
    ]);
    actor.data.data.skills[skillKey].roll(event, options, (roll) => {
        let resultMessage = `<hr /><h3>${action.name}</h3>`;
        let validTarget = false;
        for (const target of game.user.targets) {
            const dc =
                target.actor?.data?.data?.saves?.[action.targetDC.toLowerCase()]
                    ?.value + 10;
            if (dc) {
                validTarget = true;
                let successStep =
                    roll.total >= dc
                        ? roll.total >= dc + 10
                            ? 3
                            : 2
                        : roll.total > dc - 10
                        ? 1
                        : 0;
                switch (roll.terms[0].results[0].result) {
                    case 20:
                        successStep++;
                        break;
                    case 1:
                        successStep--;
                        break;
                }
                resultMessage += `<hr /><b>${target.name}:</b>`;
                if (successStep >= 3) {
                    resultMessage += `<br />💥 <b>Critical Success</b>
                        ${
                            action.degreesOfSuccess?.criticalSuccess
                                ? `<br />${action.degreesOfSuccess.criticalSuccess}`
                                : ""
                        }`
                } else if (successStep === 2) {
                    resultMessage += `<br />✔️ <b>Success</b>
                    ${
                        action.degreesOfSuccess?.success
                            ? `<br />${action.degreesOfSuccess.success}`
                            : ""
                    }`
                } else if (successStep === 1) {
                    resultMessage += `<br />❌ <b>Failure</b>
                        ${
                            action.degreesOfSuccess?.failure
                                ? `<br />${action.degreesOfSuccess.failure}`
                                : ""
                        }`
                } else if (successStep <= 0) {
                    resultMessage += `<br />💔 <b>Critical Failure</b>
                    ${
                        action.degreesOfSuccess?.criticalFailure
                            ? `<br />${action.degreesOfSuccess.criticalFailure}`
                            : ""
                    }`
                }
            }
        }
        if (validTarget) {
            ChatMessage.create({
                user: game.user._id,
                speaker: ChatMessage.getSpeaker(),
                content: resultMessage,
            });
        }
    });
})();
