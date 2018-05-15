module.exports = ( link )=>{

    return `
        <html>
        <head>
            <title>Document</title>
        </head>
        <body>
            <table>
                <tr>
                    <td>
                        <a href="${link}">Click here to activate your account!</a>
                    </td>
                </tr>
            </table>
        </body>
        </html>
    `;

};
