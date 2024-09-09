import yaml
import httpx
from datetime import datetime
import os
import time
import socket

# 定义跳过检测 URL 部分列表
EXCLUDED_URL_PARTS = [
    "youtube.com",
    "twitter.com",
    "facebook.com",
    "t.me",
    "tiktok.com",
    "github.com",
    "pinterest.com",
    "dash.cloudflare.com",
    "imacso.com",
    "appstorrent.ru",
    "liaozhaichatroom.com",
    "neal.fun",
    "inpandora.com",
    "vercel.app",
    "videezy.com",
    "pexels.com",
    "motionelements.com",
    "mazwai.com",
    "ignitemotion.com",
    "amz123.com",
    "xiaobaituai.com",
    "6a6z.com",
    "imacso.com",
    "rss-source.com",
    "798798.site",
    "lumalabs.ai",
    "typecho.org",
    "noiseyp.top",
    "pixabay.com",
    "bratgenerator.xyz",
    "noisework.cn",
    "noisevip.cn",
    "noiseblogs.top",
    # 可以根据需要添加更多部分
]

def dns_lookup(domain):
    """检查域名是否可以解析。"""
    try:
        socket.gethostbyname(domain)
        return True
    except socket.error:
        print(f"DNS 查找失败，域名: {domain}")
        return False

def should_exclude_url(url):
    """检查 URL 是否包含待检测部分，返回是否应排除。"""
    for part in EXCLUDED_URL_PARTS:
        if part in url:
            print(f"URL {url} 包含待检测部分 '{part}'，标记为有效。")
            return True
    return False

def get_proxy():
    """请求新的代理地址。"""
    try:
        response = httpx.get("https://api.geoproxy.in/http")
        print(f"API 返回内容: {response.text}")  # 打印 API 返回的原始内容
        if response.status_code == 200:
            return response.text.strip()  # 直接返回代理地址，去掉多余的空格
    except Exception as e:
        print(f"获取代理时发生错误: {e}")
    return None

def check_url(url, retries=5, timeout=20):
    """检查 URL 的有效性，支持重试机制。"""
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
    }

    if should_exclude_url(url):
        return True, url

    domain = url.split("//")[-1].split("/")[0]
    if not dns_lookup(domain):
        print(f"域名 {domain} 无法解析，跳过 URL: {url}")
        return False, None

    for attempt in range(retries):
        proxy = get_proxy()  # 获取新的代理地址
        if proxy:
            print(f"使用代理: {proxy}")
            try:
                with httpx.Client(proxies={"http://": proxy, "https://": proxy}, timeout=timeout) as client:
                    response = client.get(url, headers=headers)
                    if response.status_code == 200:
                        return True, url
                    elif response.status_code == 404:
                        print(f"链接未找到 (404)，URL: {url}，标记为删除。")
                        return False, None
                    elif response.status_code == 502:
                        print(f"服务器错误状态码 (502)，URL: {url}，标记为失效链接。")
                        return False, None
                    elif response.status_code in [403, 526]:
                        print(f"访问被拒绝 (403) 或 SSL 问题 (526)，URL: {url}，标记为审核。")
                        return None, None
                    elif "Error establishing a database connection" in response.text:
                        print(f"数据库连接错误，URL: {url}，标记为审核。")
                        return None, None
                    elif 400 <= response.status_code < 500:
                        print(f"客户端错误状态码 {response.status_code}，URL: {url}，保持有效。")
                        return True, url
                    elif 500 <= response.status_code < 600:
                        print(f"服务器错误状态码 {response.status_code}，尝试 {attempt + 1}")
                        time.sleep(2)
            except (httpx.TimeoutException, httpx.NetworkError, httpx.RemoteProtocolError) as e:
                print(f"URL {url} 发生错误: {e}，正在重试...")
                time.sleep(2)
        else:
            print("获取代理失败，正在重试...")

    print(f"经过 {retries} 次尝试验证 URL 失败: {url}")
    return False, None

def write_yaml(yaml_file, data):
    """将更新后的数据写回 YAML 文件，并保留第一行 '---'。"""
    with open(yaml_file, 'w', encoding='utf-8') as file:
        file.write('---\n')  # 保留 YAML 文件的开头
        yaml.safe_dump(data, file, allow_unicode=True, sort_keys=False)

def clean_invalid_urls(yaml_file, report_file):
    """清理 YAML 文件中的无效 URL 并生成报告。"""
    try:
        with open(yaml_file, 'r', encoding='utf-8') as file:
            content = file.read()

        if not content.startswith('---'):
            print("YAML 文件必须以 '---' 开头。")
            return

        content = content.replace('\t', '    ')
        data = yaml.safe_load(content)

    except yaml.YAMLError as e:
        print(f"解析 YAML 文件时出错: {e}")
        return

    if not isinstance(data, list):
        print("YAML 文件不包含条目列表。")
        return

    invalid_links_report = []
    auto_modified_links_report = []
    review_links_report = []

    # 处理每个分类
    for category in data:
        if 'links' in category:
            valid_links = []
            for link in category['links']:
                url = link.get('url')
                if url:
                    is_valid, new_url = check_url(url)
                    if is_valid:
                        valid_links.append(link)  # 保留有效链接
                    elif is_valid is False:
                        print(f"移除无效链接条目: {link}")
                        invalid_links_report.append(link)  # 记录无效链接
                    elif new_url:  # 如果有新的可访问地址
                        print(f"自动重定向，旧 URL: {url} -> 新 URL: {new_url}")
                        link['url'] = new_url  # 更新为新的可访问地址
                        auto_modified_links_report.append(link)  # 记录为自动重定向
                        valid_links.append(link)  # 保留更新后的链接
                    else:
                        print(f"链接需人工审核，URL: {url}，标记为有效。")
                        review_links_report.append(link)  # 标记为人工审核
                        valid_links.append(link)  # 将其视为有效链接
                else:
                    valid_links.append(link)  # 保留无 URL 的链接

            category['links'] = valid_links

    write_yaml(yaml_file, data)

    report_dir = os.path.dirname(report_file)
    os.makedirs(report_dir, exist_ok=True)

    try:
        with open(report_file, 'r', encoding='utf-8') as report:
            old_content = report.read()
    except FileNotFoundError:
        old_content = ""

    current_date = datetime.now().strftime("%Y年%m月%d日 %H:%M")
    new_report_content = f"## 检查日期: {current_date}\n\n"

    if auto_modified_links_report:
        new_report_content += "# 自动修改的重定向网站\n\n"
        for link in auto_modified_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  原始 URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if review_links_report:
        new_report_content += "# 需人工检查的链接\n\n"
        for link in review_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if invalid_links_report:
        new_report_content += "# 已失效链接\n\n"
        for link in invalid_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"

    if not auto_modified_links_report and not invalid_links_report and not review_links_report:
        new_report_content += "# 当前所有链接均有效\n"

    with open(report_file, 'a', encoding='utf-8') as report:  # 使用 'a' 模式以追加内容
        report.write(new_report_content)  # 直接写入新报告内容

def main(yaml_file_path, report_file_name):
    """主函数，用于清理无效 URL。"""
    print("开始 URL 验证过程...")
    clean_invalid_urls(yaml_file_path, report_file_name)
    print("URL 验证过程完成。")

if __name__ == "__main__":
    yaml_file_path = './data/webstack.yml'
    report_file_name = './content/invalidlinks.md'
    main(yaml_file_path, report_file_name)
