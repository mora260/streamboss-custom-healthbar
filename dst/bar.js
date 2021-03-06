// ------------------------- User Config -------------------------
const loop = false;

const bosses = [
    {
        name: 'Ganondorf',
        imgUrl: 'https://pbs.twimg.com/profile_images/2606925168/ganondorf_avatar_9_by_329summer-d3df3pd_400x400.png'
    },
    {
        name: 'Joker',
        imgUrl: 'https://store.playstation.com/store/api/chihiro/00_09_000/container/ES/es/999/EP1018-CUSA00135_00-AV00000000000017/1565694006000/image?w=240&h=240&bg_color=000000&opacity=100&_version=00_09_000'
    },
    {
        name: 'Voldemort',
        imgUrl: 'https://i1.sndcdn.com/avatars-000502043685-dxmtsh-t500x500.jpg'
    }
]

// ------------------------- User Config -------------------------

// ------------------------- Health Bar Code -------------------------

let timeOut = null;
let bossCounter = 0;

// Events will be sent when the boss is damaged or killed.
// Please use event listeners to run functions.
document.addEventListener('bossLoad', function(obj) {
    // obj.detail will contain information about the current boss
    // this will fire only once when the widget loads
    $('#boss-name').text(bosses[bossCounter].name);
    $('#boss-avatar').attr('src', bosses[bossCounter].imgUrl);
    $('#current_health').text(obj.detail.current_health);
    $('#total_health').text(obj.detail.total_health);
    setHealthBarState(obj.detail.current_health, obj.detail.total_health)
    setDamageAndMessageHidden()
});
    
document.addEventListener('bossDamaged', function(obj) {
    // obj.detail will contain information about the boss and a
    // custom message
    if(timeOut) {
        clearTimeout(timeOut);
    }
    if(bossCounter < bosses.length) { 
        $('#boss-name').text(bosses[bossCounter].name);
        $('#boss-avatar').attr('src', bosses[bossCounter].imgUrl);
        $('#current_health').text(obj.detail.boss.current_health);
        $('#total_health').text(obj.detail.boss.total_health);
        $('#message').text(obj.detail.message.text);
        $('#damage').text(obj.detail.message.damage);
        setHealthBarState(obj.detail.boss.current_health, obj.detail.boss.total_health)
        setDamageAndMessageVisible(5000)
    } else {
        $('#message').text('The Viewers Win!!');
        $('#damage').text('Enough!!');
    }
    
});

// Similarly for for when a boss is killed
document.addEventListener('bossKilled', function(obj) {
    if(timeOut) {
        clearTimeout(timeOut);
    }
    const heroName = getHeroName(obj.detail.message.text);
    $('#message').text(heroName + ' killed ' + bosses[bossCounter].name);
    $('#damage').text(obj.detail.message.damage);
    $('#current_health').text('0');
    setHealthBarState('0', obj.detail.boss.total_health)
    setDamageAndMessageVisible(10000, true);
    bossCounter++;
    if(bossCounter >= bosses.length && loop) {
        bossCounter = 0;
    }
    timeOut = setTimeout(restartBossBattle, 10000, obj);
    
});

function setHealthBarState ( current_health, total_health ) {
    const ch = parseInt(current_health);
    const th = parseInt(total_health);
    if (ch < th/3) {
        $('.boss-health-bar-outer').css('background-color', 'var(--danger-health-bar-background-color)')
        $('.boss-health-bar-inner').css('background-color', 'var(--danger-health-bar-color)')
    } else if (ch < 2*th/3) {
        $('.boss-health-bar-outer').css('background-color', 'var(--damaged-health-bar-background-color)')
        $('.boss-health-bar-inner').css('background-color', 'var(--damaged-health-bar-color)')
    } else {
        $('.boss-health-bar-outer').css('background-color', 'var(--healthy-health-bar-background-color)')
        $('.boss-health-bar-inner').css('background-color', 'var(--healthy-health-bar-color)')
    }
    const ratio = ch/th;
    const newPixels = Math.floor(280 * ratio);
    $('.boss-health-bar-inner').css('width', ''.concat(newPixels,'px'))
}

function setDamageAndMessageVisible(time, isKill) {
    $('.message').css('visibility', 'visible')
    $('.damage').css('visibility', 'visible')
    if (!isKill) {
        timeOut = setTimeout(setDamageAndMessageHidden, time);
    }
}

function setDamageAndMessageHidden() {
    $('.message').css('visibility', 'hidden')
    $('.damage').css('visibility', 'hidden')
}

function getHeroName (message) {
    return message.split(' ')[0];
}

function restartBossBattle(obj) {
    setDamageAndMessageHidden();
    if(bossCounter < bosses.length) {
        $('#boss-name').text(bosses[bossCounter].name);
        $('#boss-avatar').attr('src', bosses[bossCounter].imgUrl);
        $('#current_health').text(obj.detail.boss.current_health);
        $('#total_health').text(obj.detail.boss.total_health);
        setHealthBarState(obj.detail.boss.current_health, obj.detail.boss.total_health)
    }
}
