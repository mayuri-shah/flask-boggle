class BoggleGame  {
    constructor(board,secs){
        this.secs = secs,
        this.showtimer();
        this.board = $("#" + board),
        this.score = 0,
        this.words = new Set();

        this.timer = setInterval(this.tick.bind(this),1000)

        $(".add-word",this.board).on("submit",this.hadlesubmit.bind(this))
    }

    showmsg(msg,cls){
        $(".msg",this.board).text(msg).removeClass().addClass(`msg ${cls}`);
    }

    showtimer(){
        $(".timer",this.board).text(this.secs);
    }

    async tick(){
        this.secs -= 1;
        this.showtimer();

        if(this.secs === 0){
            clearInterval(this.timer);
            await this.scoreGame();
        }

    }

    async scoreGame(){
        $(".add-word",this.board).hide();
        const res = await axios.post("/post-score", { score : this.score});
        if(res.data.brokerecord){
            this.showmsg(` new score : ${this.score}`,"ok");
        }else{
            this.showmsg(`Final Record score : ${this.score}`,"ok");
        }
    }
    

    async hadlesubmit(evt){
        evt.preventDefault();
        const $word = $(".word",this.board);
        let word = $word.val();
        //alert(word);

        if(!word)
        return;

        if(this.words.has(word)){
            this.showmsg(`${word} has already in word set`,"err");
            return;
        }

        const res = await axios.get("/check-word",
        {
            params : { word : word }
        });
        
        if(res.data.result === "not-word"){
            this.showmsg(`${word} is not a word`,"err");
            return;
        }
        else if(res.data.result === "not-on-board"){
            this.showmsg(`${word} is not on board`,"err");
            return;
        }
        else{
            this.words.add(word);
            this.score += word.length;
            $(".words",this.board).append($("<li>", { text : word}));
            $(".score",this.board).text(this.score);
            this.showmsg(`${word} added`,"ok");
        }
        $word.val("").focus();
        

    }

}