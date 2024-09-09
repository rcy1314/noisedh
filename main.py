import yaml
import os
import time
import http.client
from urllib.parse import urlparse
from datetime import datetime

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
    "noisedh.cn",
    "noisedaohang.vercel",
    "noisevip.cn",
    "noiseblogs.top",
    "noisedaohang.netlify.app",
    "app.netlify.com",
    # 可以根据需要添加更多部分
]

def should_exclude_url(url):
    """检查 URL 是否包含待检测部分，返回是否应排除。"""
    for part in EXCLUDED_URL_PARTS:
        if part in url:
            print(f"URL {url} 包含待检测部分 '{part}'，标记为有效。")
            return True
    return False

def check_url(url, retries=3, timeout=10):
    """检查 URL 的有效性，支持重试机制。"""
    # 检查 URL 是否在排除列表中
    if should_exclude_url(url):
        return True, url  # 直接标记为有效

    parsed_url = urlparse(url)
    host = parsed_url.netloc
    path = parsed_url.path if parsed_url.path else "/"

    for attempt in range(retries):
        try:
            conn = http.client.HTTPConnection(host, timeout=timeout)
            conn.request("HEAD", path)  # 使用 HEAD 请求以减少数据传输
            response = conn.getresponse()
            conn.close()

            if response.status == 200:
                return True, url  # 返回有效链接
            elif response.status == 404:
                print(f"链接未找到 (404)，URL: {url}，标记为删除。")
                return False, None  # 标记为删除
            elif response.status in [403, 502, 526]:
                print(f"访问被拒绝或服务器错误，URL: {url}，标记为审核。")
                return None, None  # 标记为人工审核
            else:
                print(f"收到状态码 {response.status}，URL: {url}，继续重试...")
        
        except Exception as e:
            print(f"请求 URL {url} 发生错误: {e}，正在重试...")
            time.sleep(2)  # 等待后重试

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

    # 处理每个分类
    for category in data:
        if 'links' in category:
            valid_links = []
            for link in category['links']:
                url = link.get('url')
                if url and not should_exclude_url(url):
                    is_valid, new_url = check_url(url)
                    if is_valid:
                        valid_links.append(link)  # 保留有效链接
                    else:
                        print(f"移除无效链接条目: {link}")
                        invalid_links_report.append(link)  # 记录无效链接
                else:
                    valid_links.append(link)  # 保留无 URL 的链接或被排除的链接

            category['links'] = valid_links

    write_yaml(yaml_file, data)

    report_dir = os.path.dirname(report_file)
    os.makedirs(report_dir, exist_ok=True)

    current_date = datetime.now().strftime("%Y年%m月%d日 %H:%M")
    new_report_content = f"## 检查日期: {current_date}\n\n"

    if invalid_links_report:
        new_report_content += "# 已失效链接\n\n"
        for link in invalid_links_report:
            new_report_content += f"- 标题: {link.get('title', '未知')}\n"
            new_report_content += f"  URL: {link.get('url', '无 URL')}\n"
            new_report_content += f"  描述: {link.get('description', '无描述')}\n\n"
    else:
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
