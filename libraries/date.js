import moment from 'moment';

const dateFormat = 'YYYY年MM月DD日';

export default date = {
    format(date) {
        return moment(date).format(dateFormat);
    }
}