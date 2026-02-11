
export class AppOfficeUsersUtils {

    private static officeUsers:string[] = [
        'mrawashdeh',
        'mrawashdeh2',
        'mrawashdeh3',
        'amuez',
        'tareq_alzoubi',
        'mawwad',
        'aliomari',
        'test_android',
        'yy8h7ph',
        'altaleb',
        'hadeel1',
        'ehab',
        'saadatk',
        'amiraali',

        // close clients to amuez
        'hopeless'
    ];

    public static isOfficeUser(username:string):boolean{
        return AppOfficeUsersUtils.officeUsers.indexOf(username.toLowerCase()) != -1;
    }

}
