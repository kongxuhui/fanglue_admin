export const queryMixin = {
    data() {
        return {
            queryType: 'name',
            queryContent: '',
            curPage: 1,
            totalCount: 0,
            pageNum: 10
        }
    },
    methods: {
        handleQuery() {
            this.curPage = 1;
            this.$http.post({
                transCode: this.transCode,
                funType: 'findAll',
                pageCount: this.pageNum,
                currentPageNum: this.curPage,
                [this.queryType]: this.queryContent,
                ...this.initCondition
            }).then(data => {
                this.totalCount = data.totalCount;
                this.queryCallBack(data);
            })
        },
        handleCurrentChange(page) {
            this.curPage = page;
            this.getData(this.initCondition);
        },
        getData(data) {
            this.$http.post({
                transCode: this.transCode,
                funType: 'findAll',
                pageCount: this.pageNum,
                currentPageNum: this.curPage,
                ...data,
                ...this.initCondition
            }).then(data => {
                this.totalCount = data.totalCount;
                this.queryCallBack(data);
            })
        },
        messageTip(data) {
            if (data.code === '000000') {
                this.$message({
                    type: 'success',
                    message: data.message
                })
            } else {
                this.$message({
                    type: 'error',
                    message: data.message
                })
            }
        }
    },
    computed: {
        totalPage() {
            return Math.ceil(this.totalCount / this.pageNum)
        }
    }
}