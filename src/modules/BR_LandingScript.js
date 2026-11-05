$(document).ready(function() {
    // 1. Hero Banner & Text Styling
    $('[name="LandingBanner"]').parent().css({"position": "relative"});
    $('[name="LandingBanner"]').css({"padding": "8rem 5rem", "position": "relative", "z-index": "10", "background-color": "transparent"});
    $('[name="dlbSlogan"]').css({"line-height": "1.02","letter-spacing": "-.01em","overflow":"visible"});
    $('[name="dlbSlogan"]').each(function() {
        this.style.setProperty("font-size", "clamp(42px, 6.6vw, 84px)", "important");
    });
    $('p.banner-landing').css({"color": "white"}); 
    $('p[name="eyebrow"]').css({"font-size": "12px", "letter-spacing": ".34em", "text-transform": "uppercase"});
    $('p[name="sub"]').css({"font-size":"clamp(15px, 1.5vw, 18px)","line-height" : "1.62", "max-width" : "560px"});
    
    // 2. Background & Veil
    $('div.rhero-veil').css({"position": "absolute", "inset": "0", "z-index": "1", "background": "linear-gradient(90deg, rgba(45, 29, 21, .6), rgba(45, 29, 21, .12) 58%, transparent 88%), linear-gradient(0deg, rgba(40, 25, 18, .6), transparent 42%)", "pointer-events": "none"});
    
    // 3. Banner Buttons Default State
    $('[name="btnStartRegistration"]').css({"background-color": "white","color":"var(--color-primary)"});
    $('[name="btnTrackApplication"]').each(function() {
        this.style.setProperty("background-color", "transparent", "important");
        this.style.setProperty("color", "white", "important");
        this.style.setProperty("border-color", "white", "important");
    });
    
    // 4. Banner Buttons Hover States
    $('[name="btnStartRegistration"]').hover(
        function() { this.style.setProperty("background-color", "#F3E9E3", "important"); },
        function() { 
            this.style.setProperty("background-color", "white", "important");
            this.style.setProperty("color", "var(--color-primary)", "important");
        }
    );
    
    $('[name="btnTrackApplication"]').hover(
        function() {
            this.style.setProperty("background-color", "rgba(255, 255, 255, 0.1)", "important");
            this.style.setProperty("border-color", "white", "important");
        },
        function() { this.style.setProperty("background-color","transparent", "important"); }
    );
    
    // 5. Cards HTML Injection
    $('a[name="btnStartRegistrationCard"]').html(`<div class="LPCard" style="text-align:start; display: flex; width: 100%; box-sizing: border-box; flex-direction: column;"><span style="width: 46px; height: 46px; border-radius: 0;background: rgba(255, 255, 255, .16);display: flex;align-items: center;justify-content: center;margin-bottom: 18px;"><svg style="fill: none; stroke: #ffffff; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;" width="22" height="22" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"></circle><path d="M12 8v8M8 12h8"></path></svg></span><h3 style="color: #ffffff">Register as a new broker</h3><p style="color: #ffffff; text-wrap: auto">Individual or company, local or international. A few minutes to complete.</p><span style="color: #ffffff; margin-top: 18px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px">Start registration <svg style="fill: none; stroke: #ffffff; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;" width="15" height="15" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span></div>`);
    
    $('a[name="btnApprovedBrokerSignIn"]').css({"background-color": "#ffffff","border-color":"#ffffff"});
    $('a[name="btnApprovedBrokerSignIn"]').html(`<div class="LPCard" style="text-align:start; display: flex; width: 100%; box-sizing: border-box; flex-direction: column;"><span style="width: 46px; height: 46px; border-radius: 0;background: #F3E9E3;display: flex;align-items: center;justify-content: center;margin-bottom: 18px;"><svg style="fill: none; stroke: #9E6850; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;" width="22" height="22" viewBox="0 0 24 24"><rect x="4" y="11" width="16" height="10" rx="2"></rect><path d="M8 11V7a4 4 0 0 1 8 0v4"></path></svg></span><h3 style="color: #000000">Approved broker sign in</h3><p style="color: #9a8c83; text-wrap: auto">Access your broker workspace with the credentials Retal issued you.</p><span style="color: #9E6850; margin-top: 18px; font-size: 13px; display: inline-flex; align-items: center; gap: 6px">Go to sign in <svg style="fill: none; stroke: #9E6850; stroke-width: 1.7; stroke-linecap: round; stroke-linejoin: round;" width="15" height="15" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"></path></svg></span></div>`);
    
    // 6. Card Hover States (Fixed translateY)
    $('a[name="btnApprovedBrokerSignIn"]').hover(
        function() {
            this.style.setProperty("transform", "translateY(-2px)", "important");
            this.style.setProperty("border-color", "#9E6850", "important");
        },
        function() {
            this.style.setProperty("transform", "translateY(0px)", "important");
            this.style.setProperty("background-color","#ffffff", "important");
            this.style.setProperty("border-color","#ffffff","important");
        }
    );
    
    $('a[name="btnStartRegistrationCard"]').hover(
        function() { this.style.setProperty("transform", "translateY(-2px)", "important"); },
        function() { this.style.setProperty("transform", "translateY(0px)", "important"); }
    );
});