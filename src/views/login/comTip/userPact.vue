<template>
	<div class="edit_dialog">
		<el-dialog title="用户协议" :visible.sync="userPop" :before-close="dialogFormCancel" :close-on-click-modal='true' width="736px" height="606px">

			<div class="contentBox">

				<p class="pactTitle jiacu">极洲互动用户协议</p>

				<br />
				<br />
				<p class="neirong">极洲互动用户协议（以下简称“本协议”）为极洲互动与您之间权利与义务的规范。请仔细阅读本协议，<span class="jiacu">特别是加粗部分。</span></p>
				<br />
				<br />
				<p class="neirong jiacu">一、【协议内容、生效、修订及终止】</p>
				<br />
				<br />
				<p class="neirong">1.1 本协议内容包括协议正文、本协议明确援引的其他协议以及所有极洲互动已经发布的或将来可能发布的各类规则。所有规则均为本协议不可分割的组成部分，与协议正文具有同等法律效力。除另行明确声明外，您使用极洲互动服务均受本协议约束。<br />
					<br />1.2 您应当在使用极洲互动服务之前认真阅读全部协议内容，如您对本协议有任何疑问，应及时向极洲互动咨询。<span class="jiacu">您在使用极洲互动服务，或者在您界面中出现同意选项的位置同意这些条款，即表示同意遵守本协议，而无需对本协议任何条款进行增删、修改。</span>如果您不同意，请立即停止注册或停止使用极洲互动服务。一旦您接受这些条款，本协议即生效并对您产生约束。如果您继续使用极洲互动服务，则表示您将持续遵守本协议的全部约定。<br />
					<br /><span class="jiacu">1.3 极洲互动有权在必要时通过发出公告等合理方式修改本协议。您在使用极洲互动服务时，应当及时查阅了解修改的内容，并自觉遵守本协议的相关内容。您如继续使用极洲互动服务，则视为对修改内容的同意，当发生有关争议时，以最新的协议为准；您在不同意修改内容的情况下，请停止使用极洲互动服务。</span><br />
					<br /><span class="jiacu">1.4 极洲互动始终在不断变更和改进服务。极洲互动可能会增加或删除部分服务，也可能暂停或彻底停止本项服务。您同意极洲互动有权行使上述权利且不需对您或第三方承担任何责任。</span></p>
				<br />
				<br />
				<p class="neirong jiacu">二、【帐号及使用规范】</p>
				<br /><br />
				<p class="neirong">2.1 注册流程<br /> 如您希望使用极洲互动服务，您需先登录您的帐号，或注册极洲互动认可的帐号并登录。您若选用极洲互动认可的第三方帐号登录极洲互动的，您应保证第三方帐号的稳定性、真实性以及可用性。如因第三方帐号原因（如第三方帐号被封号）致使您无法登录极洲互动的，您应与第三方帐号的所属公司联系。您登录的帐号是极洲互动确认您身份的唯一依据。<br /><span class="jiacu"> 您确认：您是具备完全民事权利能力和完全民事行为能力的自然人、法人或其他组织，有能力对您使用极洲互动提供的服务的一切行为独立承担责任。若您不具备前述主体资格，请在您的监护人的陪同下阅读本协议，极洲互动在依据法律规定或本协议约定要求您承担责任时，有权向您的监护人追偿。</span>
				</p>
				<br /><br />
				<p class="neirong">2.2 您注册成功后，可开通新的企业域，也可申请加入已有的企业域。如您为企业域的所有者或授权管理员，您可以邀请他人在企业域内使用极洲互动，您应对企业域内所有发生行为（包括域内其他登陆用户的任何行为）所产生的后果负责，您应当提请所有域内的登录用户阅读本协议并督促其遵守。您使用极洲互动的功能的范围受限于您所属企业域购买极洲互动服务所签署协议的约定以及所属企业域对您的授权范围。所属企业域基于企业管理需求，对您的企业组织成员身份及基于该身份的相关权益进行管理，包括但不限于加入、删除以及调整权限和限制服务内容等。您保证在遵守本协议的同时，按照所属企业域的授权范围和规范、以及所属企业域购买极洲互动服务所签署协议的约定使用极洲互动服务。
				</p><br /><br />
				<p class="neirong">2.3 帐号使用规范</p><br /><br /> 极洲互动帐号信息资料包括但不限于您的帐号名称、头像、密码、注册或更新极洲互动帐号时输入的所有信息。您在注册、登陆和使用极洲互动帐号时承诺遵守法律法规、社会主义制度、国家利益、公民合法权益、公共秩序、社会道德风尚和信息真实性等七条底线，不得在极洲互动帐号资料中出现违法和不良信息，且您保证在注册、登陆和使用帐号时，不得有以下情形：
				<p class="neirong">（1）违反宪法或法律法规规定的；</p><br /><br />
				<p class="neirong">（2）危害国家安全，泄露国家秘密，颠覆国家政权，破坏国家统一的；</p><br /><br />
				<p class="neirong">（3）损害国家荣誉和利益的，损害公共利益的；</p><br /><br />
				<p class="neirong">（4）煽动民族仇恨、民族歧视，破坏民族团结的；</p><br /><br />
				<p class="neirong">（5）破坏国家宗教政策，宣扬邪教和封建迷信的；</p><br /><br />
				<p class="neirong">（6）散布谣言，扰乱社会秩序，破坏社会稳定的；</p><br /><br />
				<p class="neirong">（7）散布淫秽、色情、赌博、暴力、凶杀、恐怖或者教唆犯罪的；侮辱或者诽谤他人，侵害他人合法权益的；
				</p><br /><br />
				<p class="neirong">（8）含有法律、行政法规禁止的其他内容的。</p><br /><br />
				<p class="neirong">若您注册、登录、使用帐号名称、头像、个人简介等帐号信息资料存在违法和不良信息或包含有不正确、不真实信息的，极洲互动有权采取通知限期改正、暂停使用等措施。对于冒用关联机构或社会名人登录、使用、填写帐号名称、头像、个人简介等信息的，极洲互动有权取消该帐号的使用，并向政府主管部门进行报告。</p><br /><br />
				<p class="neirong">2.4 您应对注册和使用的极洲互动帐号负责，您保证只有您本人可以使用您的极洲互动帐号，该帐号不可转让、不可赠与、不可继承。 2.5 您应保管好自己的帐号和密码，如因您未保管好自己的帐号和密码而对自己、极洲互动或第三方造成损害的，您将自负全部责任。另外，您应对您帐号中的所有活动和事件负全责。您同意若发现有非法使用您的帐号或出现安全漏洞的情况，立即通告极洲互动。同时，您理解极洲互动对您的请求采取行动需要合理期限，在极洲互动采取措施前，极洲互动对已执行的指令及所导致的您的损失不承担任何责任。</p>
				<br /><br />
				<p class="neirong jiacu">三、【极洲互动服务】</p><br /><br />
				<p class="neirong">3.1服务内容<br /> 极洲互动提供包括但不限于客户管理、任务创建、文章/表单创建、数据报表可视化等功能模块的技术服务，您可以通过极洲互动来实现客户跟进管理及相关功能。除非本协议另有其它明示规定，极洲互动所推出的所有服务内容，均受到本协议之规范。您有权选择极洲互动提供的服务内容，并获得极洲互动提供的技术支持。您应根据自身需求，选择极洲互动服务中的具体使用成员、服务类型等，您的选择一经做出，即对您有约束力。
					<br /> 3.2服务费用
					<br /><br /> 极洲互动服务中可能包括收费服务、免费服务，具体以极洲互动对外公布的信息为准。若您使用极洲互动服务中的收费服务，应按照极洲互动服务官方网站公布的计费标准和方式支付相关费用。 免费服务的使用可能需要满足一定的条件，具体条件以极洲互动服务官方网站公布的条件为准。对于免费服务，极洲互动有权根据实际情况，对免费服务的具体服务内容、服务期限及服务标准等进行变更。为此，极洲互动无需向您承担任何责任。 极洲互动可能根据实际需要对收费服务的收费标准、方式等进行修改和变更，或对部分免费服务开始收费。前述修改、变更或开始收费前，极洲互动将在相应服务页面进行通知或公告。
				</p>
				<br /><br />
				<p class="neirong jiacu">四、【您的权利与义务】</p><br /><br />
				<p class="neirong">
					4.1 在支付了相应费用的前提下，您有权获得本协议项下约定的极洲互动服务。
					<br /><br />4.2 如您在使用极洲互动服务的过程中发现服务有任何错误或漏洞的，可以向极洲互动发送报告，告知该等错误或漏洞的特征。极洲互动收到此类报告经查验核实后向您提供反馈。
					<br /><br />4.3 您理解，极洲互动服务仅提供相关的网络服务，除此之外与相关网络服务有关的设备（如个人电脑、手机、及其他与接入互联网或移动网有关的装置）及所需的费用（如为接入互联网而支付的电话费及上网费、为使用移动网而支付的手机费）均应由您自行负担。
					<br /><br />4.4 您使用极洲互动服务对外提供开展业务的，应自行办理相关审批，如您未办理必要审批而开展此类业务的，因此造成的后果与极洲互动无关。如因此给极洲互动及/或极洲互动关联公司造成损失的，您应负责全额赔偿。
					<br /><br />4.5 极洲互动在此郑重提请您注意，任何经由极洲互动以上传、张贴或任何其他方式传送的资讯、资料、文字、软件、音乐、音讯、照片、图形、视讯、信息、您的登记资料或其他资料（以下简称“内容”），无论系公开还是私下传送（以下简称“发布”），均由内容提供者、使用者对其上传、使用行为自行承担责任。您保证您使用极洲互动服务或通过极洲互动服务发布内容时将遵从国家、地方法律法规、行业惯例和社会公共道德，并且不会利用极洲互动服务进行制作、复制、存储、传送、发布、传播如下信息和内容：
					<br />（1）违反国家法律法规政策的任何内容（信息）；
					<br />（2）违反国家规定的政治宣传或新闻信息；
					<br />（3）涉及国家秘密或安全的信息；
					<br />（4）封建迷信或淫秽、色情、下流的信息或教唆犯罪的信息；
					<br />（5）博彩有奖、赌博游戏；
					<br />（6）违反国家民族和宗教政策的信息；
					<br />（7）妨碍互联网运行安全的信息；
					<br />（8）侵害他人合法权益的信息；
					<br />（9）其他有损于社会秩序、社会治安、公共道德的信息或内容。
					<br /><br />如您违反前述规定，应自行承担全部责任。如您的前述违法行为给极洲互动及/或极洲互动关联公司造成损失的，您应负责全额赔偿。
					<br /><br />4.6 非经极洲互动许可，您不得向第三方转让或部分转让极洲互动向您提供的服务。
					<br /><br />4.7 您不应在自有系统之上安装、使用盗版软件；如您使用盗版或不正规软件导致极洲互动服务不可用的，极洲互动不承担责任。
					<br /><br />4.8您使用极洲互动服务过程中不得直接或间接从事以下行为：
					<br />（1）不得从事任何违法犯罪活动；
					<br />（2）不得修改、翻译、改编、出租、转许可、在信息网络上传播或转让极洲互动提供的服务或软件，也不得通过逆向工程、反编译或试图以其他方式发现极洲互动提供的服务或软件的源代码；
					<br />（3）不得以任何方式干扰或企图干扰极洲互动任何部分或功能的正常运行，包括但不限于使用未经极洲互动授权或许可的任何插件、外挂、系统或第三方工具登陆、使用或对极洲互动及相关服务的正常运行进行干扰、破坏、修改或施加其他影响，或制作、发布、传播上述工具；
					<br />（4）不得通过修改或伪造极洲互动运行中的指令、数据等任何方式，增加、删减、更改极洲互动的功能或运行效果，或者运营用于上述用途的软件、方法或将其向公众传播，无论这些行为是否为商业目的；
					<br />（5）不得使用非极洲互动提供的任何机器人程序、蜘蛛程序、爬网程序、刮板或其他自动化方式或接口访问服务或提取数据；
					<br />（6）不得删除、隐匿、改变极洲互动服务上显示或其中包含的任何专利权、版权、商标权或其他所有权声明；
					<br />（7）不得出于发送垃圾短信或其他商业短信的目的，发送任何未经请求或未经授权而主动提供的广告、诱导性信息、宣传材料、垃圾短信、连锁信或传销信息，或者隐瞒或歪曲短信发送者的身份；
					<br />（8）不得从事虚假或误导性活动，包括但不限于提交、发布虚假信息，或冒充、利用他人名义发布信息，或有其他误导、欺骗他人行为；
					<br />（9）不得诱导、强制其他用户点击链接、分享信息；
					<br />（10）不得侵害他人名誉权、肖像权、知识产权、商业秘密等合法权利，包括但不限于未经授权分享有版权的音乐、图片、视频等；
					<br />（11）不得获取、收集或向他人提供其他用户的电子邮件地址、通讯号码等信息，除非获得他们的同意；
					<br />（12）不得使用或试图使用您未得到使用授权的任何帐户；
					<br />（13）不得避开、尝试避开任何极洲互动的内容保护机制或者数据度量工具；
					<br />（14）不得利用极洲互动服务向第三方提供与极洲互动服务直接竞争的服务；
					<br />（15）不得从事其他违反法律法规规定、侵犯他人合法权益、干扰极洲互动正常运营的行为。
					<br /><br />4.9 您须对您在使用极洲互动服务过程中的行为承担法律责任。您承担法律责任的形式包括但不限于：对受到侵害者进行赔偿，以及在极洲互动首先承担了因您行为导致的行政处罚或侵权损害赔偿责任后，您应给予极洲互动等额的赔偿。若您违反以上规定，极洲互动有权作出独立判断立即暂停或终止对您提供部分或全部服务，包括采取冻结、取消帐号使用权限以及删除用户内容等措施。
					<br /><br />4.10您有义务对极洲互动及相关服务中您以外的其他用户提供的内容自行进行判断，并承担因使用上述内容而引起的所有风险，包括因对该等内容的真实性、准确性、完整性或实用性的依赖而产生的风险。极洲互动无法且不会对其他用户提供的内容的真实性、准确性、完整性、实用性和时效性承担任何责任，也不对您信赖上述内容而造成的损失或损害承担赔偿责任。
					<br /><br />4.11 您通过或使用极洲互动访问第三方网站或获取第三方提供的产品或服务时，因第三方网站、程序（包括小程序）及其功能、内容导致的用户风险和损失，由用户自行承担，由此导致的纠纷由您与该第三方共同解决，极洲互动不承担任何责任。极洲互动也不为第三方网站和程序（包括小程序）提供任何的技术支持或客服支持。</p>
				<br /><br />
				<p class="neirong jiacu">五、【极洲互动的权利与义务】<br /><br /> 5.1 极洲互动的一切著作权、商标权、专利权、商业秘密、专有技术等知识产权，除了涉及第三方授权许可的部分外，均归极洲互动完整而独立地享有。极洲互动服务包含的任何图片、视频、音频、文本、板式、代码、文档等，其知识产权均归极洲互动完整而独立地享有。本协议的生效并不意味着上海极洲互动信息科技有限公司对上述知识产权向您做出任何明示或默示的转让、授权或许可。除本协议另有约定外，未经极洲互动书面同意，您不得擅自使用、修改、复制、传播、改变、散布、发行或发表上述内容，不得创造与上述内容有关的派生产品、或以转让/许可的方式授权第三方实施、利用和转让上述内容。如有违反，您同意承担由此给极洲互动及/或极洲互动关联公司造成的一切损失。</p>
					<br /><br /><span class="jiacu">5.2 当您上传内容至极洲互动时，即赋予了极洲互动在全球范围内免费使用该内容的权利，仅当该等使用出于如下目的：</span>
					<br /><span class="jiacu">（1）向您提供更好的功能和服务；</span>
					<br /><span class="jiacu">（2）改进极洲互动的产品与服务的质量</span><br /><br />
				<p class="neirong">5.3 极洲互动根据其他主体的投诉、自有监控技术来检测可能会损害极洲互动、其他用户或其他违背本协议的行为。在调查这些问题时，极洲互动或其关联方将审查您的内容，以调查真实情况。
					<br /><br />5.4 若经过调查后，极洲互动确定您的内容确已违反本协议、或者极洲互动收到其他用户的投诉、收到知识产权侵权投诉，或者其他要求删除的行政/司法命令，极洲互动有权删除、限制传播或禁止访问您的内容。为了保护极洲互动服务或其他用户，也为了保证本协议的条款得到实施，极洲互动还有权进一步采取行动，包括但不限于立即暂停或终止继续向您提供服务，并保存有关记录向相关主管部门报告。</p>
				<br /><br />
				<p class="neirong jiacu">六、【责任限制与免责】</p><br /><br />
				<p class="neirong jiacu">6.1 极洲互动对不可抗力导致的损失不承担责任。本协议所指不可抗力包括：天灾、法律法规或政府指令的变更，因网络服务特性而特有的原因，例如境内外基础电信运营商的故障、光缆等基础设施损坏、计算机或互联网相关技术缺陷、互联网覆盖范围限制、计算机病毒、黑客攻击等因素，及其他合法范围内的不能预见、不能避免并不能克服的客观情况。</p>
					<br /><br />6.2 极洲互动是一个向您提供数据同步、管理和分享等的在线服务。极洲互动本身不直接上传、提供内容，对您传输内容不做任何修改或编辑。<span class="jiacu">用户之间或用户与其他权利人之间因使用相关内容或作品而产生或可能产生的任何纠纷和/或损失，由您自行协商解决并承担相应的责任，与极洲互动无关。极洲互动不能保证内容的合法性、正确性、完整性、真实性或品质。</span>
					<br /><br /><p class="jiacu">6.3 极洲互动对其提供的所有服务将尽力维护其安全性及方便性，但对因甲方原因导致的数据删除或储存失败不承担任何责任。</p>
				<br /><br />
				<p class="neirong">6.4 您了解极洲互动无法保证其所提供的服务毫无瑕疵，但极洲互动承诺不断提升服务质量及服务水平。所以您同意：即使极洲互动提供的服务存在瑕疵，但上述瑕疵是当时行业技术水平所无法避免的，其将不被视为极洲互动违约。您同意和极洲互动一同合作解决上述瑕疵问题。</p>
				<br /><br />
				<p class="neirong jiacu">6.5 任何情况下，极洲互动都不承担因您使用或不能使用极洲互动服务所引起的或有关的任何间接的、意外的、特殊的、惩罚性的或其它任何损失的赔偿责任。</p>
				<br /><br />
				<p class="neirong">6.6极洲互动并不放弃本协议中未提及的在法律适用的最大范围内极洲互动享有的限制、免除或抵消极洲互动损害赔偿责任的任何权利。</p>
				<br /><br />
				<p class="neirong jiacu">七、【隐私政策】</p>
				<br /><br />
				<p class="neirong">7.1 您知悉并同意，为便于向您提供更好的服务，极洲互动将在您自愿选择服务或者提供信息的情况下收集您的个人信息，并将这些信息进行整合。在您使用极洲互动服务时，服务器会自动记录一些信息，包括但不限于URL、IP地址、浏览器类型、使用语言、访问日期和时间等。为方便您登录或使用极洲互动服务，极洲互动在有需要时将使用cookies等技术，并将收集到的信息发送到对应的服务器。您可以选择接受或者拒绝cookies。如您选择拒绝cookies，则您有可能无法登录或使用依赖于cookies的服务或者功能。极洲互动收集的信息将成为极洲互动常规商业档案的一部分，且有可能因为转让、合并、收购、重组等原因而被转移到极洲互动的继任公司或者指定的一方。极洲互动同意善意使用收集的信息，且采取各项措施保证信息安全。
					<br /><br />7.2 尊重用户个人隐私是极洲互动的一项基本政策。所以，极洲互动不会公开或透露您的注册资料及保存在极洲互动服务中的非公开内容，除非极洲互动在诚信的基础上认为透露这些信息在以下几种情况是必要的：
					<br />（1）事先获得您的明确授权；或
					<br />（2）遵守有关法律规定，包括在国家有关机关查询时，提供您的注册信息、您在极洲互动的网页上发布的信息内容及其发布时间、互联网地址或者域名；或
					<br />（3）保持维护极洲互动的知识产权和其他重要权利；或
					<br />（4）在紧急情况下竭力维护您个人和社会大众的隐私安全；或
					<br />（5）根据本协议相关规定或者极洲互动认为必要的其他情况下。
					<br /><br />7.3极洲互动可能会与第三方合作向您提供极洲互动的相关服务，在此情况下，如该第三方同意承担与极洲互动同等的保护用户隐私的责任，则极洲互动可将您的信息提供给该第三方。
					<br /><br />7.4 您了解并同意，极洲互动有权应有权部门的要求，向其提供您提交给极洲互动或在使用极洲互动服务中存储于极洲互动服务器的必要信息。如您涉嫌侵犯他人合法权益，则极洲互动有权在初步判断涉嫌侵权行为存在的情况下，向权利人提供关于您的前述必要信息。</p>
				<br /><br />
				<p class="neirong jiacu">八、【其他】</p>
				<br /><br />
				<p class="neirong">8.1 服务中止、中断及终止
					<br /><br /><span class="jiacu">极洲互动根据自身商业决策等原因可能会选择中止、中断及终止服务。如有此等情形发生，极洲互动会采取公告的形式通知您。 </span><br /><br /><span class="jiacu">您同意，出于执行行政/司法机关的命令、维护极洲互动服务的安全、维护其他人的正常使用与数据安全、回应其他主体的侵权诉求等理由，极洲互动有权不经事先通知的中止、终止向您提供部分或全部极洲互动服务，暂时冻结或永久冻结（注销）您的帐户在极洲互动的权限，且无须为此向您或任何第三方承担任何责任，</span>但是极洲互动有权利继续保存该帐户相关的数据信息。 <br /><br />出现以下情况时，极洲互动有权直接以注销帐户的方式终止本协议，并有权永久冻结（注销）您的帐户在极洲互动的权限：
					<br />（1）您提供的您信息中的主要内容不真实、不准确、不及时或不完整；
					<br />（2）本协议（含规则）变更时，您明示并通知极洲互动不愿接受新的服务协议的；
					<br />（3）其它极洲互动认为应当终止服务的情况。

					<br /><br />您的服务被终止后，使用极洲互动服务的权利将立即结束，同时您使用与服务相关的软件的许可也将终止。服务终止后，<span class="jiacu">极洲互动将禁用您的帐户并有权删除您的内容。依照本条款的规定，极洲互动不对您的内容的删除承担任何责任。</span>
					<br /><br />8.2保密
					<br /><br />您和极洲互动对于因使用极洲互动服务而了解或接触到的对方的商业秘密及其他机密和信息，服务和协议内容及您使用极洲互动过程中产生的相关信息及往来文件（以下统称“保密信息”）均应保守秘密；非经书面同意，不得向第三方泄露、给予或转让该保密信息。本保密条款不因本协议的终止而终止。
					<br /><br />8.3 通知
					<br /><br />所有发给您的通知都可通过电子邮件、常规的信件或在网站显著位置公告的方式进行传送。为使您及时、全面了解极洲互动提供的各项服务，您同意，极洲互动可以多次、长期向您发送各类商业性短信息而无需另行获得您的同意。
					<br /><br />8.4 本协议适用中华人民共和国的法律（不含冲突法）。当本协议的任何内容与中华人民共和国法律相抵触时，应当以法律规定为准，同时相关内容将按法律规定进行修改或重新解释，而本协议其他部分的法律效力不变。<span class="jiacu">凡因本协议引起的或与本协议有关的任何争议，均应提交中国国际经济贸易仲裁委员会，按照申请仲裁时该会现行有效的仲裁规则进行仲裁，并由3名仲裁员进行审理。仲裁裁决是终局的，对双方均有约束力。</span>
					<br /><br />8.5 本协议自发布之日起实施，并构成您和极洲互动之间的共识。
					<br /><br />8.6 极洲互动不行使、未能及时行使或者未充分行使本协议或者按照法律规定所享有的权利，不应被视为放弃该权利，也不影响极洲互动在将来行使该权利。</p><br /><br /><br />
				<!--<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>
			<p class="neirong"></p>-->

			</div>

			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="okPact">同意并继续</el-button>
			</div>
		</el-dialog>
	</div>
</template>
<script>
	export default {
		props: {
			userPop: {
				type: Boolean,
			}
		},
		data() {
			return {}
		},
		mounted() {

		},
		inject: ['getAuthoriz'],
		methods: {
			okPact() {
				console.log('同意')
				//this.getAuthoriz()
				this.$emit('closePact')
				//	this.userPop = false
			},
			dialogFormCancel() {
				this.$emit('cancelPop')
			},
			getAuthCode(v) {
				this.$network
					.get('/user-service/user/callBack', {
						auth_code: v,
						expires_in: '',
						state: '',
					})
					.then((res) => {
						localStorage.setItem('token', res.data.accessToken)
						this.$router.push('/')
					})
			},
		},
	}
</script>
<style lang="less" scoped>
	.pactTitle {
		height: 33px;
		font-family: PingFangSC-Medium;
		line-height: 33px;
		font-size: 24px;
		color: #3C4353;
		letter-spacing: 0;
		font-weight: bold;
	}
	
	.neirong {
		line-height: 20px;
		font-size: 14px;
		color: #3C4353;
		font-weight: 400;
	}
	
	.jiacu {
		font-weight: bold;
	}
	
	.contentBox {
		width: 710px;
		height: 459px;
		background: #FAFBFF;
		border-radius: 8px;
		margin: 0 auto;
		overflow-y: scroll;
		padding: 15px;
	}
	
	/deep/.el-dialog {
		position: relative;
		/*overflow-y: scroll;*/
		height: 606px;
		background: #ffffff;
		box-shadow: 0px 2px 12px 0px rgba(0, 0, 0, 0.1);
		border-radius: 8px;
		.el-dialog__header {
			height: 50px;
			background: #fafbff;
			border-radius: 8px 8px 0px 0px;
			border-bottom: 1px solid #f0f2f7;
			.el-dialog__title {
				font-size: 16px;
				font-weight: 500;
				color: #3c4353;
				position: absolute;
				top: 13px;
			}
		}
		.el-dialog__body {
			/*overflow-y: scroll;*/
			height: 491px!important;
			padding: 16px 16px;
			.el-textarea__inner {
				width: 634px !important;
			}
			.titleAdd {
				display: inline-block;
				font-size: 16px;
				font-weight: 600;
				margin-left: 8px;
			}
			.bottom_form {
				margin-top: 40px;
			}
		}
	}
	
	/deep/.el-dialog__body {
		padding: 16px 16px;
	}
	
	/deep/ .el-dialog__footer {
		padding: 0;
		/* position: absolute;
       bottom: 16px;
       right: 16px;*/
		text-align: center;
		position: relative;
		top: 8px;
		.el-button {
			width: 110px;
			height: 32px;
			background: #4168F6;
			border-radius: 4px;
			line-height: 7px;
			/*width: 60px;
        height: 32px;
        border-radius: 4px;*/
			text-align: center;
			/* padding: 0;
        border: 1px solid #d9dae4;*/
		}
		.el-button--primary {
			background: #4168f6;
		}
	}
	
	/deep/.el-dialog {
		height: 606px !important;
	}
</style>