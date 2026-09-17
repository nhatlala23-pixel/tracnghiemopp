import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const topics = [
  { name: "OOP cơ bản", file: "part01.json", startId: 1, endId: 40 },
  { name: "Class & Object", file: "part02.json", startId: 41, endId: 80 },
  { name: "Encapsulation", file: "part03.json", startId: 81, endId: 120 },
  { name: "Inheritance", file: "part04.json", startId: 121, endId: 160 },
  { name: "Polymorphism", file: "part05.json", startId: 161, endId: 200 },
  { name: "Abstraction", file: "part06.json", startId: 201, endId: 240 },
  { name: "Constructor", file: "part07.json", startId: 241, endId: 280 },
  { name: "Interface", file: "part08.json", startId: 281, endId: 320 },
  { name: "Exception", file: "part09.json", startId: 321, endId: 360 },
  { name: "Tổng hợp", file: "part10.json", startId: 361, endId: 400 },
];

const difficulties = ["easy", "medium", "hard"];

// Template banks per topic to generate realistic, pedagogical questions
const questionTemplates = {
  "OOP cơ bản": [
    {
      q: "Khái niệm cốt lõi nào trong OOP cho phép mô phỏng thực thể thế giới thực thành các đơn vị phần mềm?",
      options: {
        A: "Đối tượng (Object) bao gồm trạng thái (thuộc tính) và hành vi (phương thức)",
        B: "Hàm con (Subroutine) thuần túy không lưu giữ trạng thái",
        C: "Con trỏ bộ nhớ trực tiếp đến ô nhớ vật lý",
        D: "Cấu trúc vòng lặp vô hạn"
      },
      ans: "A",
      exp: "Trong OOP, đối tượng (Object) đại diện cho thực thể đời thực, gồm trạng thái (attributes/fields) và hành vi (methods)."
    },
    {
      q: "Bốn tính chất nền tảng của lập trình hướng đối tượng gồm những tính chất nào?",
      options: {
        A: "Đóng gói, Kế thừa, Đa hình, Trừu tượng hóa",
        B: "Tuần tự, Rẽ nhánh, Lặp, Đệ quy",
        C: "Biên dịch, Thông dịch, Tối ưu hóa, Đóng gói",
        D: "Bảo mật, Phân tán, Đa luồng, Đồng bộ"
      },
      ans: "A",
      exp: "Bốn trụ cột của OOP là: Encapsulation (Đóng gói), Inheritance (Kế thừa), Polymorphism (Đa hình) và Abstraction (Trừu tượng)."
    },
    {
      q: "Lợi ích nổi bật nhất của phương pháp lập trình hướng đối tượng so với lập trình hướng thủ tục là gì?",
      options: {
        A: "Khả năng tái sử dụng mã nguồn, dễ bảo trì và mở rộng hệ thống lớn",
        B: "Tốc độ thực thi luôn nhanh hơn hợp ngữ assembly",
        C: "Không cần cấp phát bộ nhớ RAM khi chạy chương trình",
        D: "Tự động sửa tất cả các lỗi logic thời gian chạy"
      },
      ans: "A",
      exp: "OOP giúp chia nhỏ hệ thống thành các module đối tượng độc lập, tăng tính tái sử dụng và khả năng bảo trì hệ thống quy mô lớn."
    },
    {
      q: "Quan hệ 'IS-A' (Là một) trong thiết kế hướng đối tượng thể hiện mối liên hệ nào?",
      options: {
        A: "Quan hệ kế thừa (Inheritance)",
        B: "Quan hệ chứa đựng (Composition)",
        C: "Quan hệ phụ thuộc tạm thời (Dependency)",
        D: "Quan hệ giao tiếp mạng"
      },
      ans: "A",
      exp: "Quan hệ 'IS-A' biểu thị một lớp con là một dạng đặc biệt của lớp cha (ví dụ: Dog IS-A Animal)."
    },
    {
      q: "Quan hệ 'HAS-A' (Có một) trong hướng đối tượng biểu thị điều gì?",
      options: {
        A: "Quan hệ bao hàm/chứa đựng (Composition hoặc Aggregation)",
        B: "Quan hệ kế thừa từ lớp cha",
        C: "Quan hệ nạp chồng phương thức",
        D: "Quan hệ ghi đè phương thức"
      },
      ans: "A",
      exp: "Quan hệ 'HAS-A' biểu thị một đối tượng chứa hoặc tham chiếu đến một đối tượng khác (ví dụ: Car HAS-A Engine)."
    }
  ],
  "Class & Object": [
    {
      q: "Sự khác biệt căn bản giữa Class (Lớp) và Object (Đối tượng) là gì?",
      options: {
        A: "Class là khuôn mẫu thiết kế, Object là một thể hiện cụ thể (instance) được cấp phát bộ nhớ",
        B: "Class chiếm bộ nhớ runtime còn Object chỉ tồn tại lúc biên dịch",
        C: "Một Object có thể sinh ra nhiều Class khác nhau",
        D: "Class và Object hoàn toàn đồng nghĩa và không có sự khác biệt"
      },
      ans: "A",
      exp: "Class giống như bản thiết kế ngôi nhà, còn Object là ngôi nhà cụ thể được xây dựng trên thực tế và chiếm bộ nhớ."
    },
    {
      q: "Từ khóa 'static' gắn với một phương thức hoặc thuộc tính trong Class có ý nghĩa gì?",
      options: {
        A: "Thuộc tính hoặc phương thức đó thuộc về toàn bộ Class chứ không phụ thuộc vào từng instance cụ thể",
        B: "Giá trị của biến không bao giờ được phép thay đổi",
        C: "Phương thức chỉ được gọi duy nhất 1 lần trong suốt vòng đời",
        D: "Phương thức chỉ có thể truy cập từ bên trong cùng một file"
      },
      ans: "A",
      exp: "Thành viên static (class variable/method) được chia sẻ chung cho tất cả các đối tượng thuộc lớp và có thể gọi trực tiếp qua tên lớp."
    },
    {
      q: "Từ khóa 'this' trong hầu hết ngôn ngữ OOP (như Java, C++, C#) tham chiếu đến điều gì?",
      options: {
        A: "Chính đối tượng hiện tại đang thực thi phương thức đó",
        B: "Lớp cha của đối tượng hiện tại",
        C: "Phương thức tĩnh của lớp",
        D: "Gói thư viện chứa mã nguồn"
      },
      ans: "A",
      exp: "'this' là con trỏ/tham chiếu trỏ đến instance hiện hành của lớp đang được thao tác."
    },
    {
      q: "Bộ thu dọn rác (Garbage Collector) trong môi trường thực thi OOP có nhiệm vụ gì?",
      options: {
        A: "Tự động giải phóng vùng nhớ heap của các đối tượng không còn được tham chiếu",
        B: "Tự động xóa các file tạm trong ổ đĩa cứng của máy tính",
        C: "Tối ưu hóa các vòng lặp for trong mã nguồn",
        D: "Biên dịch mã nguồn thành mã máy"
      },
      ans: "A",
      exp: "Garbage Collector quản lý bộ nhớ heap, giải phóng những vùng nhớ mà ứng dụng không còn nắm giữ tham chiếu tới."
    },
    {
      q: "Khi một biến đối tượng được gán giá trị null (hoặc nullptr), điều này có nghĩa là gì?",
      options: {
        A: "Biến tham chiếu đó hiện không trỏ đến bất kỳ đối tượng nào trong bộ nhớ",
        B: "Đối tượng chứa các thuộc tính có giá trị bằng 0",
        C: "Chương trình đã bị crash ngay lập tức",
        D: "Class bị hủy khỏi bộ nhớ cache"
      },
      ans: "A",
      exp: "null biểu thị trạng thái biến tham chiếu rỗng, chưa được khởi tạo hoặc không trỏ tới ô nhớ đối tượng nào."
    }
  ],
  "Encapsulation": [
    {
      q: "Mục đích chính của tính đóng gói (Encapsulation) trong OOP là gì?",
      options: {
        A: "Bảo vệ dữ liệu nội tại của đối tượng, ngăn chặn truy cập trực tiếp trái phép từ bên ngoài",
        B: "Tăng tốc độ xử lý đồ họa của ứng dụng",
        C: "Cho phép một lớp có thể kế thừa từ nhiều lớp khác",
        D: "Tạo liên kết động giữa hàm và con trỏ"
      },
      ans: "A",
      exp: "Đóng gói ẩn giấu trạng thái đối tượng, chỉ cho phép đọc/ghi thông qua các phương thức được kiểm soát (getter/setter)."
    },
    {
      q: "Access modifier nào hạn chế quyền truy cập nghiêm ngặt nhất, chỉ cho phép truy cập nội bộ trong cùng Class?",
      options: {
        A: "private",
        B: "protected",
        C: "public",
        D: "default (package-private)"
      },
      ans: "A",
      exp: "Modifier 'private' chỉ cho phép các hàm thành viên trong cùng một lớp truy xuất trực tiếp."
    },
    {
      q: "Tại sao nên sử dụng phương thức getter và setter thay vì để thuộc tính là public?",
      options: {
        A: "Để kiểm soát tính hợp lệ của dữ liệu (validation) và duy trì tính đóng gói",
        B: "Bắt buộc bởi hệ điều hành để chạy chương trình",
        C: "Giúp chương trình biên dịch nhanh gấp đôi",
        D: "Để các biến tự động tăng kích thước bộ nhớ"
      },
      ans: "A",
      exp: "Getter/Setter cho phép kiểm tra tính hợp lệ của dữ liệu đầu vào (validation), log, hoặc tính toán động khi truy xuất thuộc tính."
    },
    {
      q: "Access modifier 'protected' cho phép truy cập từ đâu?",
      options: {
        A: "Bên trong cùng lớp và các lớp con (subclasses) kế thừa từ lớp đó",
        B: "Bất kỳ lớp nào ở bất kỳ đâu trong toàn bộ dự án",
        C: "Chỉ duy nhất các phương thức static",
        D: "Chỉ từ các hàm main"
      },
      ans: "A",
      exp: "'protected' mở quyền cho các thành viên trong cùng lớp, cùng package (ở Java) và các lớp con kế thừa từ nó."
    },
    {
      q: "Khái niệm 'Data Hiding' (Ẩn giấu dữ liệu) liên quan mật thiết nhất với tính chất nào của OOP?",
      options: {
        A: "Encapsulation (Tính đóng gói)",
        B: "Polymorphism (Tính đa hình)",
        C: "Inheritance (Tính kế thừa)",
        D: "Overloading (Nạp chồng)"
      },
      ans: "A",
      exp: "Data Hiding là bản chất cốt lõi của Encapsulation, che giấu các chi tiết cài đặt và biến thành viên bên trong."
    }
  ],
  "Inheritance": [
    {
      q: "Tính kế thừa (Inheritance) trong OOP cho phép điều gì?",
      options: {
        A: "Lớp con tái sử dụng và mở rộng các thuộc tính, phương thức của lớp cha",
        B: "Gộp tất cả các lớp trong chương trình thành một file duy nhất",
        C: "Chuyển đổi kiểu dữ liệu int sang chuỗi tự động",
        D: "Xóa bỏ hoàn toàn nhu cầu sử dụng hàm khởi tạo"
      },
      ans: "A",
      exp: "Kế thừa cho phép xây dựng lớp mới dựa trên lớp đã có, thừa hưởng các thuộc tính/hành vi và mở rộng thêm tính năng mới."
    },
    {
      q: "Từ khóa nào thường được dùng trong ngôn ngữ OOP để gọi đến phương thức hoặc constructor của lớp cha?",
      options: {
        A: "super (hoặc base trong C#)",
        B: "this",
        C: "parent::",
        D: "root"
      },
      ans: "A",
      exp: "'super' (trong Java) hoặc 'base' (trong C#) cho phép truy cập các thành phần của lớp cha trực tiếp từ lớp con."
    },
    {
      q: "Hiện tượng 'Diamond Problem' (Kim cương kế thừa) thường xuất hiện trong trường hợp nào?",
      options: {
        A: "Đa kế thừa lớp (Multiple Inheritance) khi một lớp kế thừa từ hai lớp có cùng một lớp tổ tiên",
        B: "Đơn kế thừa tuần tự qua 4 thế hệ",
        C: "Khai báo quá nhiều biến static trong cùng một hàm",
        D: "Chạy đệ quy vô hạn"
      },
      ans: "A",
      exp: "Diamond Problem xảy ra trong đa kế thừa khi lớp D kế thừa cả B và C, trong khi B và C cùng kế thừa từ A, gây mập mờ khi gọi phương thức của A."
    },
    {
      q: "Một lớp được đánh dấu bằng từ khóa 'final' (trong Java) hoặc 'sealed' (trong C#) thì có đặc điểm gì?",
      options: {
        A: "Không thể được kế thừa bởi bất kỳ lớp nào khác",
        B: "Không thể tạo đối tượng từ lớp đó",
        C: "Tất cả các phương thức trong lớp đều phải là trừu tượng",
        D: "Không được phép khai báo bất kỳ thuộc tính nào"
      },
      ans: "A",
      exp: "Lớp final/sealed là lớp đóng, ngăn cấm các lớp khác kế thừa nhằm đảm bảo tính toàn vẹn hoặc bảo mật."
    },
    {
      q: "Trong quan hệ kế thừa, thứ tự gọi hàm khởi tạo (constructor) diễn ra như thế nào khi khởi tạo đối tượng lớp con?",
      options: {
        A: "Constructor lớp cha được gọi trước, sau đó mới đến constructor lớp con",
        B: "Constructor lớp con được thực thi xong hoàn toàn rồi mới gọi lớp cha",
        C: "Chỉ constructor lớp con được gọi, constructor lớp cha bị bỏ qua",
        D: "Hai constructor chạy song song trên hai luồng khác nhau"
      },
      ans: "A",
      exp: "Để lớp con kế thừa hợp lệ các thành phần từ lớp cha, constructor của lớp cha phải luôn hoàn tất việc khởi tạo trước."
    }
  ],
  "Polymorphism": [
    {
      q: "Tính đa hình (Polymorphism) trong OOP thể hiện điều gì?",
      options: {
        A: "Một thông điệp hoặc phương thức có thể thực thi theo nhiều cách khác nhau tùy thuộc đối tượng nhận",
        B: "Một lớp có thể chứa tối đa 100 phương thức",
        C: "Chuyển đổi một biến nguyên thủy thành đối tượng số",
        D: "Chương trình có thể chạy trên cả Windows lẫn Linux"
      },
      ans: "A",
      exp: "Polymorphism (nhiều hình thái) cho phép các đối tượng thuộc các lớp khác nhau phản ứng khác nhau với cùng một lời gọi phương thức."
    },
    {
      q: "Nạp chồng phương thức (Method Overloading) là ví dụ của loại đa hình nào?",
      options: {
        A: "Đa hình lúc biên dịch (Compile-time Polymorphism / Static binding)",
        B: "Đa hình lúc chạy (Runtime Polymorphism / Dynamic binding)",
        C: "Đa hình đa luồng (Multi-threaded polymorphism)",
        D: "Đa hình mạng (Network polymorphism)"
      },
      ans: "A",
      exp: "Overloading xảy ra khi các phương thức cùng tên nhưng khác nhau về danh sách tham số trong cùng một lớp, được quyết định lúc biên dịch."
    },
    {
      q: "Ghi đè phương thức (Method Overriding) yêu cầu điều kiện gì giữa lớp con và lớp cha?",
      options: {
        A: "Phương thức ở lớp con phải có cùng tên, danh sách tham số và kiểu trả về (hoặc hiệp biến) với phương thức ở lớp cha",
        B: "Phương thức ở lớp con phải có tên hoàn toàn khác",
        C: "Phương thức ở lớp cha bắt buộc phải là private",
        D: "Phương thức ở lớp con phải có ít tham số hơn"
      },
      ans: "A",
      exp: "Overriding đòi hỏi method signature (tên, kiểu trả về, danh sách tham số) phải trùng khớp với phương thức ở lớp cha."
    },
    {
      q: "Cơ chế 'Dynamic Method Dispatch' (hay Dynamic Binding) hoạt động vào thời điểm nào?",
      options: {
        A: "Thời điểm thực thi chương trình (Runtime)",
        B: "Thời điểm viết mã trong IDE",
        C: "Thời điểm biên dịch mã nguồn (Compile-time)",
        D: "Thời điểm cài đặt gói phần mềm"
      },
      ans: "A",
      exp: "Dynamic binding quyết định phiên bản phương thức nào được gọi dựa trên kiểu thực tế của đối tượng tại thời điểm runtime."
    },
    {
      q: "Trong Java, annotation `@Override` mang lại lợi ích gì?",
      options: {
        A: "Giúp trình biên dịch kiểm tra xem phương thức có thực sự ghi đè một phương thức hợp lệ từ lớp cha hay không",
        B: "Tăng tốc độ CPU khi thực hiện phép tính toán học",
        C: "Tự động viết mã thực thi cho hàm đó",
        D: "Ngăn không cho lớp con khác ghi đè lại"
      },
      ans: "A",
      exp: "`@Override` giúp bắt lỗi chính tả trong tên hàm hoặc sai tham số ngay tại thời điểm biên dịch nếu không ghi đè chính xác."
    }
  ],
  "Abstraction": [
    {
      q: "Tính trừu tượng (Abstraction) trong lập trình hướng đối tượng tập trung vào điều gì?",
      options: {
        A: "Tập trung vào những đặc tính bản chất cốt lõi của đối tượng và ẩn đi các chi tiết cài đặt phức tạp",
        B: "Viết mã nguồn ngắn nhất có thể mà không cần đặt tên biến",
        C: "Loại bỏ hoàn toàn comment trong mã nguồn",
        D: "Tạo ra các đối tượng ngẫu nhiên không có mục đích"
      },
      ans: "A",
      exp: "Abstraction cho phép người dùng chỉ tương tác với 'hệ thống làm được gì' (interface) thay vì phải bận tâm 'hệ thống làm như thế nào' (implementation)."
    },
    {
      q: "Một lớp trừu tượng (Abstract Class) có thể được khởi tạo đối tượng trực tiếp bằng toán tử 'new' không?",
      options: {
        A: "Không, lớp trừu tượng không thể tạo đối tượng trực tiếp mà phải thông qua lớp con cụ thể kế thừa nó",
        B: "Có, hoàn toàn có thể tạo đối tượng bình thường như mọi lớp khác",
        C: "Chỉ tạo được nếu không có phương thức trừu tượng nào",
        D: "Chỉ tạo được bên trong phương thức main"
      },
      ans: "A",
      exp: "Lớp trừu tượng mang tính khuôn mẫu chưa hoàn chỉnh, do đó không thể dùng toán tử new để tạo instance trực tiếp."
    },
    {
      q: "Một phương thức trừu tượng (Abstract Method) có đặc điểm nào sau đây?",
      options: {
        A: "Chỉ có phần khai báo tên hàm, tham số, kiểu trả về và không có phần thân thực thi (body)",
        B: "Bắt buộc phải có từ khóa static",
        C: "Có thể được gọi trực tiếp mà không cần lớp con kế thừa",
        D: "Phải trả về giá trị kiểu void"
      },
      ans: "A",
      exp: "Abstract method chỉ định nghĩa chữ ký (signature) mà không có mã cài đặt `{}`. Các lớp con cụ thể phải có trách nhiệm override nó."
    },
    {
      q: "Nếu một lớp kế thừa từ một Abstract Class nhưng không ghi đè (override) hết tất cả các phương thức abstract, lớp đó phải là gì?",
      options: {
        A: "Lớp đó cũng bắt buộc phải được khai báo là Abstract Class",
        B: "Lớp đó sẽ tự động xóa các phương thức chưa ghi đè",
        C: "Chương trình sẽ tự động sinh mã mặc định rỗng",
        D: "Lớp đó trở thành một Interface"
      },
      ans: "A",
      exp: "Nếu không hiện thực hóa đầy đủ các phương thức abstract từ cha, bản thân lớp con vẫn chưa hoàn chỉnh và buộc phải là abstract class."
    },
    {
      q: "Khi nào bạn nên chọn Abstract Class thay vì một Interface đơn thuần?",
      options: {
        A: "Khi muốn chia sẻ mã nguồn cài đặt chung, có các thuộc tính không phải là hằng số hoặc có hàm khởi tạo",
        B: "Khi muốn hỗ trợ đa kế thừa hoàn toàn",
        C: "Khi tất cả các phương thức đều không có thân hàm",
        D: "Khi không muốn sử dụng quan hệ kế thừa IS-A"
      },
      ans: "A",
      exp: "Abstract Class thích hợp khi các lớp liên quan chặt chẽ cùng chia sẻ trạng thái, code dùng chung và cấu trúc phân cấp IS-A."
    }
  ],
  "Constructor": [
    {
      q: "Hàm khởi tạo (Constructor) trong OOP được gọi tự động vào thời điểm nào?",
      options: {
        A: "Khi một đối tượng mới của lớp được tạo ra bằng toán tử new",
        B: "Khi đối tượng bị thu hồi rác bởi Garbage Collector",
        C: "Khi chương trình kết thúc thực thi",
        D: "Khi file mã nguồn được lưu vào đĩa cứng"
      },
      ans: "A",
      exp: "Constructor là phương thức đặc biệt được thực thi ngay khi tạo thể hiện mới của lớp nhằm khởi gán trạng thái ban đầu cho đối tượng."
    },
    {
      q: "Quy ước đặc biệt về tên và kiểu trả về của Constructor là gì?",
      options: {
        A: "Có tên trùng khớp hoàn toàn với tên Class và tuyệt đối không khai báo kiểu trả về (kể cả void)",
        B: "Bắt buộc phải có kiểu trả về là void",
        C: "Bắt buộc phải bắt đầu bằng chữ 'init'",
        D: "Phải trả về con trỏ kiểu int"
      },
      ans: "A",
      exp: "Constructor trùng tên với class và không có kiểu trả về (không dùng void, int,...)."
    },
    {
      q: "Nếu lập trình viên không định nghĩa bất kỳ constructor nào trong Class, điều gì sẽ xảy ra?",
      options: {
        A: "Trình biên dịch sẽ tự động tạo một Default Constructor (không tham số, thân rỗng)",
        B: "Chương trình sẽ báo lỗi cú pháp không thể biên dịch",
        C: "Class đó biến thành một Abstract Class",
        D: "Không thể tạo đối tượng từ Class đó"
      },
      ans: "A",
      exp: "Khi không có constructor tường minh, compiler tự động cung cấp default constructor không đối số."
    },
    {
      q: "Khái niệm 'Constructor Overloading' (Nạp chồng hàm khởi tạo) nghĩa là gì?",
      options: {
        A: "Một Class có nhiều constructor với cùng tên nhưng khác nhau về số lượng hoặc kiểu dữ liệu của tham số",
        B: "Constructor gọi lại chính nó tạo vòng lặp vô hạn",
        C: "Một constructor có thể trả về nhiều kiểu dữ liệu cùng lúc",
        D: "Constructor của lớp cha bị ghi đè bởi lớp con"
      },
      ans: "A",
      exp: "Constructor overloading cho phép linh hoạt khởi tạo đối tượng với các bộ tham số khác nhau tùy nhu cầu."
    },
    {
      q: "Trong Java, để gọi một constructor khác trong cùng một lớp, cú pháp nào được sử dụng?",
      options: {
        A: "this(...)",
        B: "super(...)",
        C: "self.constructor()",
        D: "call(this)"
      },
      ans: "A",
      exp: "Cú pháp `this(...)` được sử dụng để gọi constructor khác trong cùng lớp (gọi là constructor chaining), và phải nằm ở dòng đầu tiên."
    }
  ],
  "Interface": [
    {
      q: "Interface trong lập trình hướng đối tượng chủ yếu được sử dụng để làm gì?",
      options: {
        A: "Định nghĩa một bản hợp đồng (contract) các hành vi mà lớp thực thi bắt buộc phải tuân theo",
        B: "Chứa các biến toàn cục cho toàn bộ hệ thống",
        C: "Tạo giao diện đồ họa người dùng bằng CSS",
        D: "Tăng tốc độ truy vấn cơ sở dữ liệu"
      },
      ans: "A",
      exp: "Interface quy định các dịch vụ hoặc hành vi mà lớp phải cài đặt mà không ép buộc cách thức chi tiết bên trong."
    },
    {
      q: "Một Class trong ngôn ngữ như Java hay C# có thể thực thi (implements) bao nhiêu Interface?",
      options: {
        A: "Có thể thực thi nhiều Interface cùng lúc (đa thực thi giao diện)",
        B: "Chỉ duy nhất một Interface",
        C: "Tối đa hai Interface",
        D: "Không được phép thực thi bất kỳ Interface nào nếu đã có lớp cha"
      },
      ans: "A",
      exp: "Java và C# không hỗ trợ đa kế thừa lớp nhưng hỗ trợ đa thực thi nhiều Interface (multiple interface implementation)."
    },
    {
      q: "Tất cả các biến (fields) được khai báo trong một Interface mặc định có thuộc tính gì (như trong Java)?",
      options: {
        A: "public static final (hằng số)",
        B: "private dynamic",
        C: "protected volatile",
        D: "default mutable"
      },
      ans: "A",
      exp: "Biến trong interface mặc định là hằng số công khai (public static final), không thể thay đổi giá trị sau khi gán."
    },
    {
      q: "Kể từ Java 8, loại phương thức nào được phép có mã thực thi (body) bên trong Interface?",
      options: {
        A: "default method và static method",
        B: "abstract method và native method",
        C: "protected method và synchronized method",
        D: "final variable method"
      },
      ans: "A",
      exp: "Java 8 bổ sung default method và static method giúp mở rộng interface mà không phá vỡ các class cũ đã triển khai."
    },
    {
      q: "Lợi ích lớn nhất của việc lập trình dựa trên Interface (Program to an interface, not an implementation) là gì?",
      options: {
        A: "Tạo ra kiến trúc liên kết lỏng (Loose Coupling), dễ thay thế và test mã nguồn (mocking)",
        B: "Giúp phần mềm không bao giờ bị tràn bộ nhớ",
        C: "Loại bỏ hoàn toàn các lỗi NullPointerException",
        D: "Tự động chuyển đổi thành ứng dụng di động"
      },
      ans: "A",
      exp: "Lập trình hướng giao diện giúp giảm sự phụ thuộc cứng vào các lớp cụ thể, tăng tính linh hoạt và khả năng kiểm thử unit test."
    }
  ],
  "Exception": [
    {
      q: "Mục đích chính của cơ chế xử lý ngoại lệ (Exception Handling) trong OOP là gì?",
      options: {
        A: "Duy trì luồng hoạt động bình thường của ứng dụng khi xảy ra lỗi bất thường và tránh việc chương trình bị sập đột ngột",
        B: "Tự động phát hiện lỗi cú pháp lúc đang gõ phím",
        C: "Ngăn chặn người dùng nhập mật khẩu sai",
        D: "Tăng tốc độ truy xuất ổ cứng SSD"
      },
      ans: "A",
      exp: "Exception handling giúp tách biệt mã xử lý lỗi ra khỏi luồng nghiệp vụ chính, bảo vệ ứng dụng không bị dừng đột ngột."
    },
    {
      q: "Khối lệnh 'finally' trong cấu trúc try-catch-finally có đặc điểm gì?",
      options: {
        A: "Luôn luôn được thực thi dù ngoại lệ có xảy ra hay không (thường dùng để đóng tài nguyên)",
        B: "Chỉ chạy khi có ngoại lệ xảy ra",
        C: "Chỉ chạy khi khối try không có bất kỳ lỗi nào",
        D: "Bị bỏ qua nếu có câu lệnh catch tương ứng"
      },
      ans: "A",
      exp: "Khối `finally` luôn chạy để dọn dẹp tài nguyên như đóng kết nối file, đóng socket, đóng kết nối cơ sở dữ liệu."
    },
    {
      q: "Sự khác biệt giữa 'Checked Exception' và 'Unchecked Exception' (trong Java) là gì?",
      options: {
        A: "Checked Exception được kiểm tra lúc biên dịch (bắt buộc phải try-catch hoặc throws), còn Unchecked xảy ra ở runtime",
        B: "Unchecked Exception bắt buộc phải khai báo throws ở đầu hàm",
        C: "Checked Exception chỉ xảy ra khi mất kết nối mạng",
        D: "Hai khái niệm này hoàn toàn tương đương nhau"
      },
      ans: "A",
      exp: "Checked exceptions (kế thừa Exception) buộc phải xử lý ở compile-time; Unchecked exceptions (kế thừa RuntimeException) xảy ra lúc chạy."
    },
    {
      q: "Lớp cơ sở cao nhất của tất cả các ngoại lệ và lỗi trong Java là lớp nào?",
      options: {
        A: "Throwable",
        B: "Exception",
        C: "Error",
        D: "RuntimeException"
      },
      ans: "A",
      exp: "Trong Java, java.lang.Throwable là cha cao nhất của cả Exception và Error."
    },
    {
      q: "Từ khóa 'throw' khác từ khóa 'throws' như thế nào?",
      options: {
        A: "'throw' dùng để ném một đối tượng ngoại lệ cụ thể, 'throws' khai báo ở chữ ký hàm về các loại ngoại lệ có thể ném ra",
        B: "'throws' dùng để ném đối tượng, 'throw' dùng để khai báo",
        C: "'throw' chỉ dùng trong khối finally",
        D: "'throws' chỉ dùng cho biến nguyên thủy"
      },
      ans: "A",
      exp: "`throw new MyException()` ném ra 1 instance ngoại lệ; `void myFunc() throws IOException` thông báo hàm có thể phát sinh ngoại lệ đó."
    }
  ],
  "Tổng hợp": [
    {
      q: "Nguyên lý Single Responsibility Principle (chữ S trong SOLID) phát biểu điều gì?",
      options: {
        A: "Một Class chỉ nên chịu một trách nhiệm duy nhất và chỉ có một lý do duy nhất để thay đổi",
        B: "Một hàm chỉ được chứa tối đa 1 dòng code",
        C: "Một dự án chỉ được phép có một người lập trình viên chịu trách nhiệm",
        D: "Một đối tượng chỉ được tạo ra một lần duy nhất"
      },
      ans: "A",
      exp: "SRP yêu cầu mỗi module/class chỉ tập trung vào một chức năng nghiệp vụ cụ thể, giúp code sáng sủa và dễ bảo trì."
    },
    {
      q: "Nguyên lý Open/Closed Principle (chữ O trong SOLID) định nghĩa như thế nào?",
      options: {
        A: "Mở cho việc mở rộng tính năng (Open for extension), nhưng Đóng cho việc sửa đổi mã nguồn đã ổn định (Closed for modification)",
        B: "Tất cả các file đều phải mở khóa trước khi chạy",
        C: "Mở tất cả các biến thành public và đóng tất cả phương thức",
        D: "Chương trình chỉ chạy khi mở kết nối internet"
      },
      ans: "A",
      exp: "OCP khuyến khích thiết kế bằng kế thừa, interface để bổ sung tính năng mới mà không phải sửa trực tiếp code cũ đã test kỹ."
    },
    {
      q: "Design Pattern 'Singleton' đảm bảo điều gì trong ứng dụng?",
      options: {
        A: "Đảm bảo một Class chỉ có duy nhất một thể hiện (instance) và cung cấp một điểm truy cập toàn cục tới nó",
        B: "Cho phép tạo vô số các bản sao của đối tượng trong bộ nhớ",
        C: "Tự động phân bổ đối tượng trên nhiều máy chủ đám mây",
        D: "Chuyển đổi giao diện của một lớp thành giao diện khác tương thích"
      },
      ans: "A",
      exp: "Singleton pattern kiểm soát việc tạo instance, đảm bảo toàn bộ ứng dụng dùng chung 1 instance (ví dụ: Logger, DB Pool)."
    },
    {
      q: "Design Pattern nào thuộc nhóm Creational cho phép tạo đối tượng mà không để lộ logic khởi tạo cụ thể ra phía client?",
      options: {
        A: "Factory Method Pattern",
        B: "Observer Pattern",
        C: "Strategy Pattern",
        D: "Decorator Pattern"
      },
      ans: "A",
      exp: "Factory Method định nghĩa interface tạo đối tượng, giao việc khởi tạo lớp cụ thể cho các subclass hoặc factory đảm nhiệm."
    },
    {
      q: "Design Pattern 'Observer' phù hợp nhất trong trường hợp nào?",
      options: {
        A: "Khi một đối tượng thay đổi trạng thái, tất cả các đối tượng phụ thuộc (subscribers) sẽ tự động nhận được thông báo và cập nhật",
        B: "Khi cần mã hóa dữ liệu truyền tải trên mạng",
        C: "Khi cần nối các chuỗi ký tự với tốc độ cao",
        D: "Khi muốn ngăn chặn không cho người dùng thoát chương trình"
      },
      ans: "A",
      exp: "Observer pattern xây dựng mối quan hệ 1-nhiều (publish-subscribe) giữa các đối tượng để đồng bộ trạng thái khi có sự kiện phát sinh."
    }
  ]
};

// Generate 40 questions per topic
const outDir = path.join(__dirname, '../src/data/questions');
fs.mkdirSync(outDir, { recursive: true });

let allGenerated = [];

topics.forEach(t => {
  const topicTemplates = questionTemplates[t.name];
  const list = [];
  const count = t.endId - t.startId + 1; // 40 questions

  for (let i = 0; i < count; i++) {
    const id = t.startId + i;
    const baseTpl = topicTemplates[i % topicTemplates.length];
    const diff = difficulties[i % difficulties.length];
    const variationIndex = Math.floor(i / topicTemplates.length) + 1;

    // Create realistic variant wording if needed
    const qTitle = variationIndex > 1
      ? `[Demo Question #${id}] (${t.name} - Mở rộng ${variationIndex}) ${baseTpl.q}`
      : `[Demo Question #${id}] ${baseTpl.q}`;

    const item = {
      id: id,
      question: qTitle,
      options: {
        A: baseTpl.options.A,
        B: baseTpl.options.B,
        C: baseTpl.options.C,
        D: baseTpl.options.D,
      },
      correctAnswer: baseTpl.ans,
      explanation: `${baseTpl.exp} (Chủ đề: ${t.name}, Mức độ: ${diff.toUpperCase()})`,
      topic: t.name,
      difficulty: diff,
    };

    list.push(item);
    allGenerated.push(item);
  }

  const filePath = path.join(outDir, t.file);
  fs.writeFileSync(filePath, JSON.stringify(list, null, 2), 'utf-8');
  console.log(`Wrote ${list.length} questions to ${t.file} (IDs ${t.startId} - ${t.endId})`);
});

console.log(`Successfully generated ${allGenerated.length} total questions across 10 parts!`);
