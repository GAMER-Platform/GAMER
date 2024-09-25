import pygame, sys
import random
# 初始化
pygame.init()
SCREEN = pygame.display.set_mode((400, 300))
pygame.display.set_caption('Hello World!')

# 绿色方块固定在最下方，左右移动，y值不变
green_x = 110
# 红色方块从上往下移动，x值不变
red_y = 0
# 游戏主循环
score = 0
pygame.font.init()
myfont = pygame.font.Font(None,60)
red_x = 35
life_times, is_over = 3, False
while True: 
    for event in pygame.event.get():
        # 处理退出事件
        if event.type == pygame.QUIT:
            pygame.quit()
            sys.exit()
        # 键盘按下事件
        elif event.type == pygame.KEYDOWN:
            # 'a'键被按下
            if event.key == pygame.K_a:
                green_x -= 5
            elif event.key == pygame.K_d:
                green_x += 5
    red_y += 5
    green_rect = pygame.Rect(green_x, 250, 100, 50)
    if green_rect.colliderect(red_x, red_y, 20, 50):
        print('红色方块与绿色方块碰撞到了')
        # 为了方便看到碰撞结果，直接break返回
        score += 1
        red_y = 0
        red_x = random.randint(50, 350)
    if red_y >= 300:
        life_times -= 1
        if life_times <= 0:
            is_over = True
        red_y = 0
        red_x = random.randint(50, 350)
        
    SCREEN.fill((255, 255, 255))
    # 调用 pygame.display.update() 方法更新整个屏幕的显示
    pygame.draw.rect(SCREEN, (255, 0, 0), (red_x, red_y, 20, 50))
    pygame.draw.rect(SCREEN, (0, 255, 0), (green_x, 250, 100, 50))
    textImage = myfont.render("score: " + str(score), True, (0, 0, 255))
    SCREEN.blit(textImage, (10,10))
    if is_over:
        gameOverTextImage = myfont.render('GAME OVER!', True, (255, 0, 0))
        SCREEN.blit(gameOverTextImage, (80,150))
    pygame.display.update()
    pygame.time.delay(50)