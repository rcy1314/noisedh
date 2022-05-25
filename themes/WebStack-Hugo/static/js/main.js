//弹窗样式
iziToast.settings({
    timeout: 10000,
    icon: 'Fontawesome',
    closeOnEscape: 'true',
    position: 'topLeft',
    transitionIn: 'bounceInRight',
    transitionOut: 'fadeOutLeft',
    displayMode: 'replace',
    layout: '2',
    titleColor: '#efefef',
    messageColor: '#efefef',
    iconColor: '#efefef',
});

iziToast.info({
    icon: 'fad fa-vial',
    title: '欢迎访问NOISE导航',
    message: '本站为静态化导航站，可永久使用'
});

//控制台输出
/*
let date = '2021-09-27 21:32'
let a = 'background: #606060; color: #fff; border-radius: 3px 0 0 3px;'
let b = 'background: #1475B2; color: #fff; border-radius: 0 3px 3px 0;'
console.log(`%c Update Time %c ${date} `, a, b)
*/
/* 样式代码 */
var styleTitle1 = `
font-size: 20px;
font-weight: 600;
color: rgb(244,167,89);
`
var styleTitle2 = `
font-style: oblique;
font-size:14px;
color: rgb(244,167,89);
font-weight: 400;
`
var styleContent = `
color: rgb(30,152,255);
`

/* 内容代码 */
var title1 = 'Noiseの主页'
var title2 = 'work.cn'
var content = `


`

//加载动画
window.addEventListener('load', function () {
    document.body.style.overflow = 'auto';
    document.getElementById('loading-box').classList.add("loaded")
}, false)


//监听网页宽度
window.addEventListener('load', function () {
    window.addEventListener('resize', function () {
        //关闭移动端样式
        if (window.innerWidth >= 600) {
            $('#row').attr('class', 'row');
            $("#menu").html("<i class='fad fa-bars'></i>");
            //移除移动端切换功能区
            $('#rightone').attr('class', 'row rightone');
        }

        if (window.innerWidth <= 990) {
            //移动端隐藏更多页面
            $('#container').attr('class', 'container');
            $("#change").html("你好&nbsp;欢迎访问&nbsp;!");
            $("#change1").html("比你优秀的人都在努力，你还有什么理由去放弃");

            //移动端隐藏弹窗页面
            $('#box').css("display", "none");
            $('#row').css("display", "flex");
            $('#more').css("display", "flex");
        }
    })
})
/*
document.getElementById("theme-toggle").addEventListener("click", () => {
    document.body.className.includes("dark") ? (document.body.classList.remove('dark'),
        localStorage.setItem("pref-theme", 'light')) : (document.body.classList.add('dark'),
        localStorage.setItem("pref-theme", 'dark'))
})
*/
//移动端切换功能区
var changemore = false;
$('#changemore').on('click', function () {
    changemore = !changemore;
    if (changemore) {
        $('#rightone').attr('class', 'row menus mobile');
    } else {
        $('#rightone').attr('class', 'row menus');
    }
});

//更多页面显示关闭按钮
$("#more").hover(function () {
    $('#close').css("display", "block");
}, function () {
    $('#close').css("display", "none");
})

