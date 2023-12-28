import pygame
import random
import os

FPS = 60
WIDTH = 500
HEIGHT = 600

BLACK = (0, 0, 0)
WHITE = (255, 255, 255)
GREEN = (0, 255, 0)
RED = (255, 0, 0)
YELLOW = (255, 255, 0)

# 遊戲初始化 and 創建視窗
pygame.init()
screen = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("First Game")
clock = pygame.time.Clock()
# 載入圖片
background_img = pygame.image.load(os.path.join("images", "starry_night_background.png")).convert()
player_img = pygame.image.load(os.path.join("images", "airplane-icon.png")).convert()
bullet_img = pygame.image.load(os.path.join("images", "bullet.png")).convert()

rock_imgs = []
for i in range(1, 5):
    rock_imgs.append(pygame.image.load(os.path.join("images", f"rock{i}.png")).convert())
rock_imgs[0] = pygame.transform.scale(rock_imgs[0], (40, 40))
rock_imgs[1] = pygame.transform.scale(rock_imgs[1], (60, 60))
rock_imgs[2] = pygame.transform.scale(rock_imgs[2], (25, 25))
rock_imgs[3] = pygame.transform.scale(rock_imgs[3], (35, 35))

font_name = pygame.font.match_font('arial')

# 載入音效
shoot_sound = pygame.mixer.Sound(os.path.join("sound", "shoot_sound.mp3"))
shoot_sound.set_volume(0.5)
expl_sounds = [
    pygame.mixer.Sound(os.path.join("sound", "rock_bomb1.mp3"))
]
pygame.mixer.music.load(os.path.join("sound", "background_music.mp3"))
pygame.mixer.music.set_volume(0.5)

def draw_text(surf, text, size, x, y):
    font = pygame.font.Font(font_name, size)
    text_suface = font.render(text, True, WHITE)
    text_rect = text_suface.get_rect()
    text_rect.centerx = x
    text_rect.top = y
    surf.blit(text_suface, text_rect)

def new_rock():
    rock = Rock()
    all_sprites.add(rock)
    rocks.add(rock)

def draw_hp(surf, hp, x, y):
    if hp < 0:
        hp = 0
    BAR_LENGTH = 100
    BAR_HEIGHT = 10
    fill = (hp/100)

def draw_init():
    screen.blit(background_img, (0, 250))
    draw_text(screen, 'Spaceship Survival', 64, WIDTH/2, HEIGHT/4)
    draw_text(screen, 'WASD: control SPACE: shoot~', 22, WIDTH/2, HEIGHT/2)
    draw_text(screen, 'Press any key to start', 18, WIDTH/2, HEIGHT*3/4)
    pygame.display.update()
    waiting = True
    while waiting:
        clock.tick(FPS)
    # 取得輸入
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                pygame.quit()
                return True
            elif event.type == pygame.KEYUP:
                waiting = False
                return False
class Player(pygame.sprite.Sprite):
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.scale(player_img, (60, 42))
        self.image.set_colorkey(WHITE)
        self.rect = self.image.get_rect()
        self.radius = 20
        # 確認碰撞的圓圈是否完整
        # pygame.draw.circle(self.image, RED, self.rect.center, self.radius)
        self.rect.centerx = WIDTH/2
        self.rect.bottom = HEIGHT - 10
        
        self.speedx = 8
        self.speedy = 8
        
        self.hp = 3
        
    def update(self):
        # 設定按鍵(操控Sprite)
        key_pressed = pygame.key.get_pressed()
        if key_pressed[pygame.K_d]:
            self.rect.x += self.speedx
        if key_pressed[pygame.K_a]:
            self.rect.x -= self.speedx
        if key_pressed[pygame.K_w]:
            self.rect.y -= self.speedy
        if key_pressed[pygame.K_s]:
            self.rect.y += self.speedy
        # 設定不會跑出邊界
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
        if self.rect.left < 0:
            self.rect.left = 0
        if self.rect.top < 0:
            self.rect.top = 0
        if self.rect.bottom > HEIGHT:
            self.rect.bottom = HEIGHT
    
    def shoot(self):
        bullet = Bullet(self.rect.centerx, self.rect.top)
        all_sprites.add(bullet)
        bullets.add(bullet)
        shoot_sound.play()
        
class Rock(pygame.sprite.Sprite):
    def __init__(self):
        pygame.sprite.Sprite.__init__(self)
        self.image_ori = random.choice(rock_imgs)
        self.image_ori.set_colorkey(BLACK)
        self.image = self.image_ori.copy()
        self.rect = self.image.get_rect()
        self.radius = int(self.rect.width * 0.85 / 2)
        # pygame.draw.circle(self.image, RED, self.rect.center, self.radius)
        self.rect.x = random.randrange(0, WIDTH - self.rect.width)
        self.rect.y = random.randrange(-100, -40)
        
        self.speedy = random.randrange(2, 8)
        self.speedx = random.randrange(-3, 3)
        self.total_degree = 0
        self.rot_degree = random.randrange(-3, 3)
        
    def rotate(self):
        self.total_degree += self.rot_degree
        self.total_degree = self.total_degree % 360
        self.image = pygame.transform.rotate(self.image_ori, self.total_degree)
        center = self.rect.center
        self.rect = self.image.get_rect()
        self.rect.center = center
        
    def update(self):
        self.rotate()
        self.rect.y += self.speedy
        self.rect.x += self.speedx
        
        if self.rect.top > HEIGHT or self.rect.left > WIDTH or self.rect.right < 0:
            self.rect.x = random.randrange(0, WIDTH - self.rect.width)
            self.rect.y = random.randrange(-100, -40)
            self.speedy = random.randrange(2, 8)
            self.speedx = random.randrange(-3, 3)

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        pygame.sprite.Sprite.__init__(self)
        self.image = pygame.transform.scale(bullet_img, (5, 10))
        self.rect = self.image.get_rect()
        self.rect.centerx = x
        self.rect.bottom = y
        self.speedy = -10
        
    def update(self):
        self.rect.y += self.speedy
        
        if self.rect.bottom < 0:
            self.kill()
            
all_sprites = pygame.sprite.Group()
rocks = pygame.sprite.Group()
bullets = pygame.sprite.Group()

player = Player()
all_sprites.add(player)
for i in range(8):
    new_rock()
score = 0
pygame.mixer.music.play(-1)
is_over = False

# 遊戲迴圈
show_init = True
running = True
while running:
    if show_init:
        close = draw_init()
        if close:
            break
        show_init = False
    
    clock.tick(FPS)
    # 取得輸入
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False
        elif event.type == pygame.KEYDOWN:
            if event.key == pygame.K_SPACE:
                player.shoot()
        
    # 更新遊戲
    all_sprites.update()
    hits = pygame.sprite.groupcollide(rocks, bullets, True, True) # 判斷rocks和bullets是否碰撞到，True為碰撞後消失，False為不消失
    for hit in hits:
        random.choice(expl_sounds).play()
        score += hit.radius
        new_rock()
        
    hits = pygame.sprite.spritecollide(player, rocks, True, pygame.sprite.collide_circle)
    for hit in hits:
        new_rock()
        player.hp -= 1
        if player.hp == 0:
            running = False
    
    # 畫面顯示
    screen.fill(BLACK)
    screen.blit(background_img, (0, 250))
    all_sprites.draw(screen)
    draw_text(screen, str(score), 18, WIDTH-20, 10)
    if is_over:
        draw_text(screen, "Game Over", 80, WIDTH/2, HEIGHT/2-20)
        show_init = True
        all_sprites = pygame.sprite.Group()
        rocks = pygame.sprite.Group()
        bullets = pygame.sprite.Group()

        player = Player()
        all_sprites.add(player)
        for i in range(8):
            new_rock()
        score = 0
        pygame.time.set_timer(pygame.USEREVENT, 1000)
        pygame.mixer.music.play(-1)
        is_over = False
    pygame.display.update()
    
pygame.quit()