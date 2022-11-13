
// TODO: нормальное склеивание строк сделать
// TODO: СТРАННО переводит строку!!!!!!!!! не понимаю почему так
// он всё делает правильно, но URL это отображает иначе
export const makeRequestString = (items: string[]) : string => {

   // console.log("ids: ", items);
    let request = items.toString();
    /*let request: string = "";
    const len = items.length;
    items.map((item, idx) => {
        if (idx != len - 1)
            request = request + item + '%';
        else
            request = request + item;
    });*/
    //console.log("request: ", request);
    return request;
}