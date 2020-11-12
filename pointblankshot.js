const effect = {
    name: "Point Blank Shot",
    modifier: {
        stat: "damage",
        value: 2,
        type: "circumstance",
    },
    iconPath: "systems/pf2e/icons/features/classes/precision.jpg",
};
(async () => {
    if((actor.data.data.customModifiers[effect.modifier.stat] || []).some(customModifier => customModifier.name === effect.name)){
        if (token.data.effects.includes(effect.iconPath)) {
            await token.toggleEffect(effect.iconPath);
        }
        await actor.removeCustomModifier(effect.modifier.stat, effect.name);
    }else{
        if (!token.data.effects.includes(effect.iconPath)) {
            await token.toggleEffect(effect.iconPath);
        }
        await actor.addCustomModifier(effect.modifier.stat, effect.name, effect.modifier.value, effect.modifier.type);
    }
})();