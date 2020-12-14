Component({
    properties: {
        target:{
            type: Number,
            optionalTypes: [String],
        },
        secondType: {
            type:Boolean,
            value:false
        },
        showDay: Boolean,
        callback: String,
        format: Array,
        clearTimer: Boolean
    },
    externalClasses: ['countdown-class','symbol-class','count-class'],
    data: {
        timeArr:[],
        time: '',
        resultFormat: [],
        changeFormat: false
    },
    ready() {
        this.getFormat();
    },
    methods: {
        getFormat() {
                        
            const data = this.data;
            const len = data.format.length;
            
            if(!data.secondType){
                data.target = typeof data.target === 'string' ? new Date(data.target).getTime() : this.data.target
            }
            
            if (!data.showDay) data.resultFormat.push('');

            if (len >= 3) {
                for (let i = 0; i < len; i++) {
                    if (data.resultFormat.length >= 4) break;
                    if (data.format[i]) {
                        data.resultFormat.push(data.format[i].toString());
                    }
                }

                if (data.resultFormat.length >= 4) data.changeFormat = true;
            }

            this.getLastTime();
        },
        init() {
            const self = this;
            this.timeout = setTimeout(function () {
                self.getLastTime.call(self);
            }, 1000);
        },
        getLastTime() {
            const data = this.data;
            
            const gapTime = data.secondType ? Math.ceil(data.target--) : Math.ceil(( data.target - new Date().getTime()) / 1000);
 
            let result = '';
            let time = '00:00:00';
            let timeArr = [];
            let day = '00';
            const format = data.resultFormat;

            if (gapTime > 0) {
                day = this.formatNum(parseInt(gapTime / 86400));
                let lastTime = gapTime % 86400;
                const hour = this.formatNum(parseInt(lastTime / 3600));
                lastTime = lastTime % 3600;
                const minute = this.formatNum(parseInt(lastTime / 60));
                const second = this.formatNum(lastTime % 60);

                if (data.changeFormat){ 
                    time = `${hour}${format[1]}${minute}${format[2]}${second}${format[3]}`;
                    timeArr = [hour,format[1],minute,format[2],second,format[3]]
                }
                else {
                    time = `${hour}:${minute}:${second}`;
                    timeArr = [hour,':',minute,':',second,':']
                }

                if (!data.clearTimer) this.init.call(this);
            } else {
                this.endfn();
            }

            if (data.showDay) {
                if (data.changeFormat) {
                    result = `${day}${format[0]} ${time}`;
                    timeArr.unshift(`${format[0]}`)
                    timeArr.unshift(`${day}`)
                } else {
                    result = `${day}d ${time}`;
                    timeArr.unshift(`d`)
                    timeArr.unshift(`${day}`)
                }
            } else {
                result = time;
            }
            this.setData({
                timeArr,
                time: result
            });

        },
        formatNum(num) {
            return num > 9 ? num : `0${num}`;
        },
        endfn() {
            this.triggerEvent('callback', {});
        }
    }
});
