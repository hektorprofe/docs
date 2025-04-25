title: Efectos de sonido y música | Curso PyGame | Hektor Profe
description: Apuntes del curso de desarrollo de videojuegos con PyGame en Python.

# Efectos de sonido y música

<div class='embed-container'><iframe width="560" height="315" src="/cdn/pygame/015.mp4" title="Video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>

```python
import sys
import random
import pygame as pg

WIDTH, HEIGHT = 720, 400
SPEED, FPS = 5, 60

pg.init()
display = pg.display.set_mode((WIDTH, HEIGHT))
background = pg.image.load("grass.png").convert_alpha()

dino_image = pg.image.load("dino.png").convert_alpha()
dino_rect = dino_image.get_rect()
dino_mask = pg.mask.from_surface(dino_image)

star_image = pg.image.load("star.png").convert_alpha()
star_rect = star_image.get_rect()
star_rect.center = (WIDTH//2, HEIGHT//2)
star_mask = pg.mask.from_surface(star_image)

# Music
pg.mixer.music.load('jungle.ogg')
pg.mixer.music.set_volume(0.75)
pg.mixer.music.play(-1, 0.0)

# Effects
star_sound = pg.mixer.Sound('star.wav')
star_sound.set_volume(.5)

clock = pg.time.Clock()
debug = True

while 1:
    for event in pg.event.get():
        if event.type == pg.QUIT:
            sys.exit()
        if event.type == pg.KEYDOWN:
            if event.key == pg.K_F1:
                debug = not debug
            if event.key == pg.K_F2:
                if pg.mixer.music.get_busy():
                    pg.mixer.music.stop()
                else:
                    pg.mixer.music.play(-1, 0.0)

    clock.tick(FPS)

    keys = pg.key.get_pressed()
    if keys[pg.K_LEFT] and dino_rect.left > 0:
        dino_rect.x -= SPEED
    if keys[pg.K_RIGHT] and dino_rect.right < WIDTH:
        dino_rect.x += SPEED
    if keys[pg.K_UP] and dino_rect.top > 0:
        dino_rect.y -= SPEED
    if keys[pg.K_DOWN] and dino_rect.bottom < HEIGHT:
        dino_rect.y += SPEED

    offset = (star_rect.x - dino_rect.x, star_rect.y - dino_rect.y)
    if dino_mask.overlap(star_mask, offset):
        star_rect.x = random.randint(50, WIDTH - 50)
        star_rect.y = random.randint(50, HEIGHT - 50)
        star_sound.play()  # play sound on collide

    display.blit(background, (0, 0))
    display.blit(dino_image, dino_rect)
    display.blit(star_image, star_rect)

    if debug:
        pg.draw.rect(display, (255, 255, 255), dino_rect, 1)
        pg.draw.rect(display, (255, 255, 255), star_rect, 1)

        dino_mask_lines = [(dino_rect.x + line[0], dino_rect.y + line[1])
                           for line in dino_mask.outline()]
        pg.draw.lines(display, (255, 0, 0), True, dino_mask_lines)

        star_mask_lines = [(star_rect.x + line[0], star_rect.y + line[1])
                           for line in star_mask.outline()]
        pg.draw.lines(display, (255, 0, 0), True, star_mask_lines)

    pg.display.update()

```

**Adjuntos**

* [dino.png]({{cdn}}/pygame/dino.png)
* [grass.png]({{cdn}}/pygame/grass.png)
* [star.png]({{cdn}}/pygame/star.png)

* [jungle.ogg]({{cdn}}/pygame/jungle.ogg)
* [star.wav]({{cdn}}/pygame/star.wav)

___
<small class="edited"><i>Última edición: 13 de Febrero de 2022</i></small>