class BankThinger {
    constructor(fileText) {
        let lines = fileText.split('\r\n')
        this.header = lines.slice(0, 1)
        this.mids = lines.slice(1, -1)
        this.footer = lines.slice(-1)
    }

    fixd() {
        let newMids = this.mids.map((t, index, arr) => {
            let specialDeal = arr.slice(index).find(t => {
                return t.substr(78, 1) === ' '
            }).substr(79, 8)
            return t.substring(0, 79) + specialDeal + t.substring(87)
        })

        return this.header
            .concat(newMids)
            .concat(this.footer)
            .join('\r\n')
    }
}

var app = new Vue({
    el: '#app',
    data: {
        filename: '',
        fileText: '\n\n\n\n',
        fileTextUpdated: '\n\n\n\n',
        displayOriginal: false
    },
    methods: {
        handleNewFile() {
            let r = new FileReader()
            r.onload = event => {
                this.fileText = event.target.result
                let bankThinger = new BankThinger(this.fileText)
                this.fileTextUpdated = bankThinger.fixd()
            }

            let f = this.$refs.fileInput.files[0]
            this.filename = f.name

            r.readAsText(f)
        },
        handleSaveButton() {
            let newFileName = this.filename.replace('.txt', '_fixed.txt')
            let blob = new Blob([this.fileTextUpdated], { type: 'text/plain;charset=utf8' })

            saveAs(blob, newFileName)
        }
    }
})
